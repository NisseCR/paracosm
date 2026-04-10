// shared/js/effects.js
export function initStoryEffects({
                                     bgLayer,
                                     overlay,
                                     hero,
                                     fadeEls,
                                     bgReady = false,
                                     fadeStart = 0.25,
                                     fadeEnd = 0.8,
                                     bgMin = 0.15,
                                     overlayMax = 0.78,
                                     revealAt = 0.88,
                                     heroFadeEnd = 0.3
                                 }) {
    bgLayer.addEventListener('animationend', () => {
        bgReady = true;
    }, { once: true });

    function onScroll() {
        const sy = window.scrollY;
        const vh = window.innerHeight;

        const p = Math.max(0, Math.min(1, (sy / vh - fadeStart) / (fadeEnd - fadeStart)));
        if (bgReady) {
            bgLayer.style.opacity = (1 - p * (1 - bgMin)).toFixed(3);
        }

        overlay.style.background = `rgba(var(--overlay-rgb), ${(p * overlayMax).toFixed(3)})`;

        const heroP = Math.max(0, Math.min(1, (sy / vh) / heroFadeEnd));
        hero.style.opacity = (1 - heroP).toFixed(3);

        fadeEls.forEach(el => {
            if (el.getBoundingClientRect().top < vh * revealAt) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}