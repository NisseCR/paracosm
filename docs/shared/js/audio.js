/**
 * MarkerAudioDirector
 *
 * A small scroll-driven audio controller for story pages.
 *
 * How it works:
 * - HTML paragraphs/blocks are marked with `data-audio-step="sceneId"`.
 * - `story-config.js` maps each `sceneId` to ambient tracks and music.
 * - When a marker is reached, the controller switches scenes.
 * - Ambience fades out/in together.
 * - Music fades out first, then the next music fades in on a later update.
 *
 * Audio concepts used here:
 * - AudioContext: the browser's audio graph and timing engine.
 * - masterGain: a global volume node for the whole story.
 * - BufferSource: a looping audio player created from a decoded file.
 * - GainNode: controls volume for each track.
 */
export class MarkerAudioDirector {
    constructor({
                    scenes = {},
                    markerSelector = '[data-audio-step]',
                    fadeInDurationMs = 4000,
                    ambienceTransitionDurationMs = 2500,
                    musicFadeOutDurationMs = 1800,
                    musicFadeInDurationMs = 1800,
                    masterVolume = 1
                } = {}) {
        this.scenes = scenes;
        this.markerSelector = markerSelector;
        this.fadeInDurationMs = fadeInDurationMs;

        // Separate durations for ambience and music.
        this.ambienceTransitionDurationMs = ambienceTransitionDurationMs;
        this.musicFadeOutDurationMs = musicFadeOutDurationMs;
        this.musicFadeInDurationMs = musicFadeInDurationMs;

        this.masterVolume = masterVolume;

        this.baseUrl = (window.__BASE_URL__ || '').replace(/\/$/, '');

        this.audioContext = null;
        this.masterGain = null;

        this.markers = [];
        this.buffers = new Map();
        this.sceneNodes = new Map();

        this.enabled = false;
        this.ready = false;
        this.currentSceneId = null;
        this._rafPending = false;
        this._musicTransitionPending = null;
    }

    /**
     * Reads the DOM and collects all marker elements that map to valid scenes.
     * Marker order matters: the order in the document is the order used for switching.
     */
    init() {
        this.markers = Array.from(document.querySelectorAll(this.markerSelector))
            .map((el) => ({ el, id: el.dataset.audioStep }))
            .filter(({ id }) => id && this.scenes[id]);

        window.addEventListener('scroll', () => this.scheduleUpdate(), { passive: true });
        window.addEventListener('resize', () => this.scheduleUpdate(), { passive: true });

        this.scheduleUpdate();
    }

    /**
     * Unlocks audio after a user gesture.
     * Browsers require user interaction before audio playback can begin.
     */
    async unlock() {
        if (this.enabled) return;
        this.enabled = true;

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0;
            this.masterGain.connect(this.audioContext.destination);
        }

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        await this.loadAllSceneAudio();
        this.startAllSceneNodes();
        this.fadeInMaster();
        this.update();
    }

    /**
     * Smoothly raises the whole audio mix from silence to masterVolume.
     */
    fadeInMaster() {
        if (!this.audioContext || !this.masterGain) return;

        const now = this.audioContext.currentTime;
        const end = now + (this.fadeInDurationMs / 1000);

        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(this.masterVolume, end);
    }

    /**
     * Converts a root-relative asset path into a GitHub Pages-safe URL.
     */
    resolveAssetUrl(path) {
        if (!path) return path;

        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('//')
        ) {
            return path;
        }

        if (!path.startsWith('/')) {
            return path;
        }

        return `${this.baseUrl}${path}`.replace(/\/{2,}/g, '/');
    }

    /**
     * Loads and decodes every unique audio file referenced by the scenes.
     * The decoded audio is stored as AudioBuffers and reused by all tracks.
     */
    async loadAllSceneAudio() {
        if (this.ready) return;

        const urls = new Set();

        for (const scene of Object.values(this.scenes)) {
            for (const ambient of scene.ambience || []) {
                urls.add(this.resolveAssetUrl(ambient.src));
            }

            const musicSrc = this.getMusicSrc(scene.music);
            if (musicSrc) {
                urls.add(musicSrc);
            }
        }

        await Promise.all(Array.from(urls).map(async (src) => {
            const response = await fetch(src);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.buffers.set(src, buffer);
        }));

        this.ready = true;
    }

    /**
     * Creates all scene nodes up front so transitions are immediate.
     */
    startAllSceneNodes() {
        for (const id of Object.keys(this.scenes)) {
            this.ensureSceneNode(id);
        }
    }

    /**
     * Returns the normalized music definition:
     * - string => { src: string, gain: 1 }
     * - object => { src, gain }
     */
    getMusicConfig(music) {
        if (!music) return null;
        if (typeof music === 'string') {
            return { src: music, gain: 1 };
        }
        return {
            src: music.src,
            gain: music.gain ?? 1
        };
    }

    getMusicSrc(music) {
        const config = this.getMusicConfig(music);
        return config ? this.resolveAssetUrl(config.src) : null;
    }

    /**
     * Ensures a scene has live audio nodes attached.
     * Each scene gets:
     * - ambience: an array of looping tracks
     * - music: a single looping music track
     */
    ensureSceneNode(sceneId) {
        if (this.sceneNodes.has(sceneId)) return this.sceneNodes.get(sceneId);

        const scene = this.scenes[sceneId];
        if (!scene) return null;

        const ambience = (scene.ambience || []).map((track) => this.createLoopingTrack(this.resolveAssetUrl(track.src)));
        const musicConfig = this.getMusicConfig(scene.music);
        const music = musicConfig ? this.createLoopingTrack(this.resolveAssetUrl(musicConfig.src)) : null;

        const node = {
            ambience: ambience.map((track, index) => ({
                ...track,
                targetGain: scene.ambience[index].gain ?? 1
            })),
            music: musicConfig && music ? {
                ...music,
                targetGain: musicConfig.gain ?? 1
            } : null
        };

        this.sceneNodes.set(sceneId, node);
        return node;
    }

    /**
     * Creates a looping BufferSource + GainNode pair for one audio file.
     */
    createLoopingTrack(src) {
        const buffer = this.buffers.get(src);
        if (!buffer) {
            throw new Error(`Audio buffer not loaded: ${src}`);
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0;

        source.connect(gain);
        gain.connect(this.masterGain);

        source.start();

        return { source, gain };
    }

    /**
     * Schedules the next update on the animation frame queue.
     */
    scheduleUpdate() {
        if (this._rafPending) return;
        this._rafPending = true;

        requestAnimationFrame(() => {
            this._rafPending = false;
            this.update();
        });
    }

    /**
     * Main update loop.
     * Detects which marker scene is currently active and transitions if needed.
     */
    update() {
        if (!this.enabled || !this.ready || !this.markers.length) return;

        const sceneId = this.getCurrentSceneId();
        if (!sceneId) return;

        if (sceneId === this.currentSceneId) {
            this.finalizePendingMusicTransition(sceneId);
            return;
        }

        const previousSceneId = this.currentSceneId;
        this.currentSceneId = sceneId;
        this.crossfadeTo(sceneId, previousSceneId);
    }

    /**
     * Returns the scene ID for the last marker that has crossed the middle of the viewport.
     */
    getCurrentSceneId() {
        const threshold = window.innerHeight * 0.5;
        let activeId = this.markers[0]?.id ?? null;

        for (const marker of this.markers) {
            const rect = marker.el.getBoundingClientRect();
            if (rect.top <= threshold) {
                activeId = marker.id;
            } else {
                break;
            }
        }

        return activeId;
    }

    /**
     * Applies a scene transition.
     *
     * Ambience:
     * - fades old ambience out
     * - fades new ambience in
     * - both can overlap
     *
     * Music:
     * - old music fades out first
     * - next music begins on a later update, once the previous fade-out is done
     */
    crossfadeTo(nextSceneId, currentSceneId) {
        const next = this.ensureSceneNode(nextSceneId);
        const current = currentSceneId ? this.ensureSceneNode(currentSceneId) : null;

        if (!next) return;

        const now = this.audioContext.currentTime;
        const ambienceDuration = this.ambienceTransitionDurationMs / 1000;
        const musicFadeOutDuration = this.musicFadeOutDurationMs / 1000;

        const ramp = (gainNode, toValue, seconds) => {
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(gainNode.gain.value, now);
            gainNode.gain.linearRampToValueAtTime(toValue, now + seconds);
        };

        // Ambience: old and new can overlap.
        if (current) {
            for (const track of current.ambience) {
                ramp(track.gain, 0, ambienceDuration);
            }
        }

        for (const track of next.ambience) {
            ramp(track.gain, track.targetGain, ambienceDuration);
        }

        // Music: fade out first, then start the new track on a later update.
        if (this._musicTransitionPending) {
            this._musicTransitionPending = null;
        }

        if (current?.music) {
            ramp(current.music.gain, 0, musicFadeOutDuration);
            this._musicTransitionPending = {
                nextSceneId,
                nextMusicReadyAt: now + musicFadeOutDuration
            };
        } else {
            this.startNextMusicIfNeeded(next);
        }
    }

    /**
     * Called on later updates to start the next music track after the old one has faded out.
     */
    finalizePendingMusicTransition(sceneId) {
        if (!this._musicTransitionPending) return;
        if (this._musicTransitionPending.nextSceneId !== sceneId) return;

        const now = this.audioContext.currentTime;
        if (now < this._musicTransitionPending.nextMusicReadyAt) return;

        const next = this.ensureSceneNode(sceneId);
        this.startNextMusicIfNeeded(next);
        this._musicTransitionPending = null;
    }

    /**
     * Fades in the scene's music using its per-scene gain value.
     */
    startNextMusicIfNeeded(next) {
        if (!next?.music) return;

        const now = this.audioContext.currentTime;
        const duration = this.musicFadeInDurationMs / 1000;

        next.music.gain.gain.cancelScheduledValues(now);
        next.music.gain.gain.setValueAtTime(0, now);
        next.music.gain.gain.linearRampToValueAtTime(next.music.targetGain, now + duration);
    }

    fadeOutAll(durationMs = 2000) {
        if (!this.audioContext || !this.masterGain) return;

        const now = this.audioContext.currentTime;
        const end = now + (durationMs / 1000);

        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0, end);
    }

    mute() {
        if (this.masterGain) {
            this.masterGain.gain.value = 0;
        }
    }

    unmute() {
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
}

export function initStoryAudio(config = {}) {
    const director = new MarkerAudioDirector(config);
    director.init();
    return director;
}