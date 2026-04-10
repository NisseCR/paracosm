export class ScrollAudioDirector {
    constructor({
                    scenes = {},
                    markerSelector = '[data-audio-step]',
                    blendWindowPx = 700,
                    masterVolume = 1,
                    musicCrossfade = true
                } = {}) {
        this.scenes = scenes;
        this.markerSelector = markerSelector;
        this.blendWindowPx = blendWindowPx;
        this.masterVolume = masterVolume;
        this.musicCrossfade = musicCrossfade;

        this.audioContext = null;
        this.masterGain = null;

        this.markers = [];
        this.buffers = new Map();

        this.sceneNodes = new Map();
        this.enabled = false;
        this.ready = false;
        this._rafPending = false;
    }

    init() {
        this.markers = Array.from(document.querySelectorAll(this.markerSelector))
            .map((el) => ({
                el,
                id: el.dataset.audioStep
            }))
            .filter(({ id }) => id && this.scenes[id]);

        window.addEventListener('scroll', () => this.scheduleUpdate(), { passive: true });
        window.addEventListener('resize', () => this.scheduleUpdate(), { passive: true });

        this.scheduleUpdate();
        this.update();
    }

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
        this.startAllNeededSources();
        this.unmute();
        this.update();
    }

    async loadAllSceneAudio() {
        if (this.ready) return;

        const urls = new Set();

        for (const scene of Object.values(this.scenes)) {
            for (const ambient of scene.ambience || []) {
                urls.add(ambient.src);
            }
            if (scene.music) {
                urls.add(scene.music);
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

    scheduleUpdate() {
        if (this._rafPending) return;
        this._rafPending = true;

        requestAnimationFrame(() => {
            this._rafPending = false;
            this.update();
        });
    }

    startAllNeededSources() {
        for (const marker of this.markers) {
            this.ensureSceneNode(marker.id);
        }
    }

    ensureSceneNode(sceneId) {
        if (this.sceneNodes.has(sceneId)) return this.sceneNodes.get(sceneId);

        const scene = this.scenes[sceneId];
        if (!scene) return null;

        const ambience = (scene.ambience || []).map((track) => this.createLoopingTrack(track.src));
        const music = scene.music ? this.createLoopingTrack(scene.music) : null;

        const node = {
            ambience: ambience.map((track, index) => ({
                ...track,
                targetGain: scene.ambience[index].gain ?? 1
            })),
            music
        };

        this.sceneNodes.set(sceneId, node);
        return node;
    }

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

    update() {
        if (!this.markers.length) return;
        if (!this.enabled || !this.ready) return;

        const state = this.computeScrollState();
        if (!state) return;

        this.applyMix(state.currentId, state.nextId, state.t);
    }

    computeScrollState() {
        const viewportCenter = window.innerHeight * 0.5;

        let currentIndex = -1;

        for (let i = 0; i < this.markers.length; i++) {
            const rect = this.markers[i].el.getBoundingClientRect();
            if (rect.top <= viewportCenter) {
                currentIndex = i;
            } else {
                break;
            }
        }

        if (currentIndex < 0) {
            currentIndex = 0;
        }

        const currentMarker = this.markers[currentIndex];
        const nextMarker = this.markers[currentIndex + 1] || null;

        if (!currentMarker) return null;

        let t = 0;

        if (nextMarker) {
            const currentRect = currentMarker.el.getBoundingClientRect();
            const nextRect = nextMarker.el.getBoundingClientRect();

            const start = currentRect.top;
            const end = nextRect.top;

            const range = Math.max(1, end - start);
            const raw = (viewportCenter - start) / range;

            t = Math.max(0, Math.min(1, raw));
        }

        return {
            currentId: currentMarker.id,
            nextId: nextMarker ? nextMarker.id : null,
            t
        };
    }

    applyMix(currentId, nextId, t) {
        const current = this.ensureSceneNode(currentId);
        const next = nextId ? this.ensureSceneNode(nextId) : null;

        if (!current) return;

        for (const track of current.ambience) {
            track.gain.gain.value = track.targetGain * (1 - t);
        }

        if (next) {
            for (const track of next.ambience) {
                track.gain.gain.value = track.targetGain * t;
            }
        } else {
            for (const track of current.ambience) {
                track.gain.gain.value = track.targetGain;
            }
        }

        if (current.music) {
            current.music.gain.gain.value = next ? (this.musicCrossfade ? (1 - t) : 1) : 1;
        }

        if (next && next.music) {
            next.music.gain.gain.value = this.musicCrossfade ? t : 0;
        }
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
    const director = new ScrollAudioDirector(config);
    director.init();
    return director;
}