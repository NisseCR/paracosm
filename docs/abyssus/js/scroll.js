import {
    FADE_START,
    FADE_END,
    BG_MIN,
    OVERLAY_MAX,
    REVEAL_AT,
    HERO_FADE_END,
} from './config.js';

export function initScrollEffects({
                                      bgLayer,
                                      overlay,
                                      hero,
                                      fadeEls,
                                  }) {
    let bgReady = false;
    bgLayer.addEventListener('animationend', () => {
        bgReady = true;
    }, { once: true });

    function onScroll() {
        const sy = window.scrollY;
        const vh = window.innerHeight;

        const p = Math.max(0, Math.min(1, (sy / vh - FADE_START) / (FADE_END - FADE_START)));

        if (bgReady) {
            bgLayer.style.opacity = (1 - p * (1 - BG_MIN)).toFixed(3);
        }

        overlay.style.background = `rgba(var(--overlay-rgb), ${(p * OVERLAY_MAX).toFixed(3)})`;

        const heroP = Math.max(0, Math.min(1, (sy / vh) / HERO_FADE_END));
        hero.style.opacity = (1 - heroP).toFixed(3);

        fadeEls.forEach(el => {
            if (el.getBoundingClientRect().top < vh * REVEAL_AT) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}