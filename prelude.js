/*
═══════════════════════════════════════════════════════════
  ✏️  Tweak these to adjust the scroll feel:

  FADE_START     fraction of screen height scrolled before
                 dimming begins (0–1)
  FADE_END       fraction where dimming is complete (0–1)
  BG_MIN         how visible the art stays at max dim
                 (0 = black, 1 = unchanged)
  OVERLAY_MAX    max opacity of the dark overlay (0–1)
  REVEAL_AT      how far into the viewport an element must
                 be before it fades in (0–1, lower = earlier)
  HERO_FADE_END  fraction of screen height scrolled before
                 the hero title is fully gone (0–1)
═══════════════════════════════════════════════════════════
*/
const FADE_START  = 0.25;
const FADE_END    = 0.80;
const BG_MIN      = 0.15;
const OVERLAY_MAX = 0.78;
const REVEAL_AT   = 0.88;
const HERO_FADE_END = 0.30;

const bg       = document.getElementById('bg');
const overlay  = document.getElementById('bg-overlay');
const hero     = document.getElementById('hero');
const hint     = document.getElementById('scroll-hint');
const fadeEls  = document.querySelectorAll('.fade-child');
let hintGone   = false;

function onScroll() {
  const sy = window.scrollY;
  const vh = window.innerHeight;

  /* Dim background */
  const p = Math.max(0, Math.min(1,
    (sy / vh - FADE_START) / (FADE_END - FADE_START)
  ));
  bg.style.opacity = (1 - p * (1 - BG_MIN)).toFixed(3);
  overlay.style.background =
    `rgba(var(--overlay-rgb), ${(p * OVERLAY_MAX).toFixed(3)})`;

  /* Fade out hero title */
  const heroP = Math.max(0, Math.min(1, (sy / vh) / HERO_FADE_END));
  hero.style.opacity = (1 - heroP).toFixed(3);

  /* Reveal fade-child elements, hide hint as soon as the first one appears */
  fadeEls.forEach((el, i) => {
    if (el.getBoundingClientRect().top < vh * REVEAL_AT) {
      el.classList.add('visible');
      if (!hintGone && i === 0) {
        hint.style.opacity = '0';
        hintGone = true;
      }
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
