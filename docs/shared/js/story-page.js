// shared/js/story-page.js
import { typeInto } from './typewriter.js';
import { initAudio } from './audio.js';
import { initStoryEffects } from './effects.js';

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

    const audioBtn = document.getElementById('audio-btn');
    const audioLabelEl = document.getElementById('audio-label');
    const audioAmbient = document.getElementById('audio-ambient');
    const audioMusic = document.getElementById('audio-music');

    if (!labelEl || !titleEl || !audioBtn || !audioLabelEl || !audioAmbient || !audioMusic) {
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

    initAudio({
        audioBtn,
        audioLabelEl,
        audioAmbient,
        audioMusic
    });

    initStoryEffects({
        bgLayer,
        overlay,
        hero,
        fadeEls
    });
}

initStoryPage();