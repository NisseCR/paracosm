import { typeInto } from './typewriter.js';
import { initStoryAudio } from './audio.js';
import { initStoryEffects } from './effects.js';

/**
 * Bootstraps a story page.
 * The story-specific audio config is passed in by the page module, so this
 * shared script can be reused by multiple stories.
 */
export function initStoryPage(storyAudio) {
    const bgLayer = document.getElementById('bg-layer');
    const overlay = document.getElementById('bg-overlay');
    const hero = document.getElementById('hero');
    const fadeEls = document.querySelectorAll('.fade-child');

    const labelEl = document.getElementById('chapter-label');
    const titleEl = document.getElementById('hero-title');

    if (!labelEl || !titleEl) {
        return;
    }

    const chapterLabel = document.body.dataset.chapterLabel ?? '';
    const heroTitle = document.body.dataset.heroTitle ?? '';

    if (chapterLabel) {
        typeInto(labelEl, chapterLabel, 55, () => {
            if (!heroTitle) return;

            window.setTimeout(() => {
                typeInto(titleEl, heroTitle, 90);
            }, 380);
        });
    }

    const audio = initStoryAudio({
        scenes: storyAudio.scenes,
        fadeInDurationMs: storyAudio.fadeInDurationMs,
        ambienceTransitionDurationMs: storyAudio.ambienceTransitionDurationMs,
        musicFadeOutDurationMs: storyAudio.musicFadeOutDurationMs,
        musicFadeInDurationMs: storyAudio.musicFadeInDurationMs,
        masterVolume: storyAudio.masterVolume
    });

    const unlockAudio = async () => {
        await audio.unlock();
        audio.unmute();
    };

    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    initStoryEffects({
        bgLayer,
        overlay,
        hero,
        fadeEls
    });
}