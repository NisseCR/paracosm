import { typeInto } from './typewriter.js';
import { initStoryAudio } from './audio.js';
import { initStoryEffects } from './effects.js';
import { STORY_AUDIO } from '../../abyssus/story.js';

/**
 * Bootstraps a story page.
 * Reads page-specific text from <body data-*> attributes so the same script
 * can power multiple chapters without duplication.
 */
function initStoryPage() {
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
        scenes: STORY_AUDIO.scenes,
        blendWindowPx: STORY_AUDIO.blendWindowPx,
        masterVolume: STORY_AUDIO.masterVolume,
        musicCrossfade: STORY_AUDIO.musicCrossfade
    });

    let audioUnlocked = false;

    const unlockAudio = async () => {
        if (audioUnlocked) return;
        audioUnlocked = true;
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

initStoryPage();