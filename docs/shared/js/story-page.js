import { typeInto } from './typewriter.js';
import { initStoryAudio } from './audio.js';
import {initScrollProgress, initStoryEffects} from './effects.js';

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

    const revealLabel = () => {
        labelEl.classList.remove('chapter-label--hidden');
    };

    const revealTitle = () => {
        titleEl.classList.remove('hero-title--hidden');
    };

    const audioHintEl = document.createElement('span');
    audioHintEl.className = 'audio-hint';
    audioHintEl.setAttribute('aria-hidden', 'true');
    audioHintEl.innerHTML = '<span class="audio-hint__icon">♪</span><span class="audio-hint__text">tap for audio</span>';

    const pageOverlay = document.createElement('div');
    pageOverlay.id = 'page-transition-overlay';
    document.body.appendChild(pageOverlay);

    const fadeOutAndNavigate = async (targetUrl) => {
        if (!targetUrl) return;

        const fadeDurationMs = 2000;

        if (typeof audio?.fadeOutAll === 'function') {
            audio.fadeOutAll(fadeDurationMs);
        } else if (typeof audio?.mute === 'function') {
            audio.mute();
        }

        pageOverlay.classList.add('visible');

        window.setTimeout(() => {
            window.location.href = targetUrl;
        }, fadeDurationMs);
    };

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a.chapter-btn');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;

        event.preventDefault();
        fadeOutAndNavigate(href);
    });

    const showAudioHint = () => {
        if (audioHintEl.isConnected) return;

        hero.appendChild(audioHintEl);

        window.setTimeout(() => {
            audioHintEl.classList.add('visible');
        }, 20);
    };

    const hideAudioHint = () => {
        if (!audioHintEl.isConnected) return;

        audioHintEl.classList.remove('visible');
        audioHintEl.addEventListener('transitionend', () => audioHintEl.remove(), { once: true });

        window.setTimeout(() => {
            audioHintEl.remove();
        }, 800);
    };

    if (chapterLabel) {
        revealLabel();
        typeInto(labelEl, chapterLabel, 55, () => {
            if (!heroTitle) return;

            window.setTimeout(() => {
                revealTitle();
                typeInto(titleEl, heroTitle, 90, showAudioHint);
            }, 380);
        });
    }

    const audio = initStoryAudio({
        scenes: storyAudio.scenes,
        fadeInDurationMs: storyAudio.fadeInDurationMs,
        ambienceTransitionDurationMs: storyAudio.ambienceTransitionDurationMs,
        musicFadeOutDurationMs: storyAudio.musicFadeOutDurationMs,
        musicFadeInDurationMs: storyAudio.musicFadeInDurationMs
    });

    const unlockAudio = async () => {
        await audio.unlock();
        audio.unmute();
        hideAudioHint();
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

    initScrollProgress()
}