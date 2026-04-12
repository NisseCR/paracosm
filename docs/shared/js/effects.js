// shared/js/effects.js

/**
 * Initialises scroll-based visual effects for a story page.
 */
export function initStoryEffects({
                                     bgLayer,
                                     overlay,
                                     hero,
                                     fadeEls,
                                     bgReady = false,
                                     fadeStart = 0.25,
                                     fadeEnd = 0.8,
                                     bgMin = 0.15,
                                     overlayMax = 0.88,
                                     revealAt = 0.88,
                                     heroFadeEnd = 0.3
                                 }) {
    if (!bgLayer || !overlay || !hero) {
        return;
    }

    const clamp01 = value => Math.max(0, Math.min(1, value));

    bgLayer.addEventListener('animationend', () => {
        bgReady = true;
    }, { once: true });

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;

    function onScroll() {
        const sy = window.scrollY;
        const vh = viewportHeight;
        const scrollRatio = sy / vh;

        const backgroundProgress = clamp01((scrollRatio - fadeStart) / (fadeEnd - fadeStart));
        if (bgReady) {
            bgLayer.style.opacity = (1 - backgroundProgress * (1 - bgMin)).toFixed(3);
        }

        overlay.style.background = `rgba(var(--overlay-rgb), ${(backgroundProgress * overlayMax).toFixed(3)})`;

        const heroProgress = clamp01(scrollRatio / heroFadeEnd);
        hero.style.opacity = (1 - heroProgress).toFixed(3);

        fadeEls.forEach(el => {
            if (el.getBoundingClientRect().top < vh * revealAt) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

export function initScrollProgress() {
    const progressFill = document.getElementById('scroll-progress-fill');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        progressFill.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
}

export function initScrollHint() {
    const hintEl = document.getElementById('scroll-hint');
    if (!hintEl) return;

    let shown = false;
    let dismissed = false;
    let showTimer = null;

    const show = () => {
        if (shown || dismissed) return;
        shown = true;
        hintEl.classList.add('visible');
    };

    const hide = () => {
        if (dismissed) return;
        dismissed = true;
        window.clearTimeout(showTimer);
        hintEl.classList.remove('visible');
    };

    const onScroll = () => {
        if (window.scrollY > 10) {
            hide();
        }
    };

    showTimer = window.setTimeout(show, 500);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
}