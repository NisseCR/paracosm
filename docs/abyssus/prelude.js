/*
═══════════════════════════════════════════════════════════
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
const FADE_START    = 0.25;
const FADE_END      = 0.80;
const BG_MIN        = 0.15;
const OVERLAY_MAX   = 0.78;
const REVEAL_AT     = 0.88;
const HERO_FADE_END = 0.30;

/*
═══════════════════════════════════════════════════════════
  ✏️  Typewriter content
═══════════════════════════════════════════════════════════
*/
const LABEL_TEXT = 'Prologue · Abyssus';
const TITLE_TEXT = 'Falling Colour';

/*
═══════════════════════════════════════════════════════════
  LABEL_SPEED   — chapter label (smaller text, can be faster)
  TITLE_SPEED   — main title
  TITLE_DELAY   — pause after label finishes before title starts (ms)
═══════════════════════════════════════════════════════════
*/
const LABEL_SPEED = 55;
const TITLE_SPEED = 90;
const TITLE_DELAY = 380;

/* ── Element refs ───────────────────────────────────────── */
const bgLayer      = document.getElementById('bg-layer');
const overlay      = document.getElementById('bg-overlay');
const hero         = document.getElementById('hero');
const fadeEls      = document.querySelectorAll('.fade-child');
const labelEl      = document.getElementById('chapter-label');
const titleEl      = document.getElementById('hero-title');
const audioBtn     = document.getElementById('audio-btn');
const audioLabelEl = document.getElementById('audio-label');
const audioAmbient = document.getElementById('audio-ambient');
const audioMusic   = document.getElementById('audio-music');

/* ── Background ready flag ──────────────────────────────── */
let bgReady = false;
bgLayer.addEventListener('animationend', () => { bgReady = true; }, { once: true });

/* ══════════════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════════════ */
function makeCursor() {
  const c = document.createElement('span');
  c.className = 'tw-cursor';
  return c;
}

function typeInto(el, text, speed, onDone) {
  el.textContent = '';
  const cursor = makeCursor();
  el.appendChild(cursor);
  let i = 0;
  const tick = setInterval(() => {
    el.insertBefore(document.createTextNode(text[i]), cursor);
    i++;
    if (i >= text.length) {
      clearInterval(tick);
      setTimeout(() => {
        cursor.classList.add('done');
        cursor.addEventListener('animationend', () => cursor.remove(), { once: true });
        if (onDone) onDone();
      }, 500);
    }
  }, speed);
}

setTimeout(() => {
  typeInto(labelEl, LABEL_TEXT, LABEL_SPEED, () => {
    setTimeout(() => {
      typeInto(titleEl, TITLE_TEXT, TITLE_SPEED, null);
    }, TITLE_DELAY);
  });
}, 700);

/* ══════════════════════════════════════════════════════════
   AUDIO
   The button is always visible. On first interaction
   (click on the button, keydown, or scroll) audio unlocks
   and begins playing. Subsequent clicks toggle it.
══════════════════════════════════════════════════════════ */
let audioUnlocked = false;
let audioOn       = true;

/*  ✏️  Adjust individual track volumes (0–1) */
audioAmbient.volume = 0.55;
audioMusic.volume   = 0.30;

/* Show the button right away — no need to wait for interaction */
audioBtn.classList.add('visible');

function startAudio() {
  audioAmbient.play().catch(() => {});
  audioMusic.play().catch(() => {});
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  startAudio();
}

audioBtn.addEventListener('click', () => {
  if (!audioUnlocked) {
    unlockAudio();          /* First press — start audio */
    return;
  }
  audioOn = !audioOn;
  if (audioOn) {
    startAudio();
    audioBtn.classList.remove('muted');
    audioLabelEl.textContent = 'sound on';
  } else {
    audioAmbient.pause();
    audioMusic.pause();
    audioBtn.classList.add('muted');
    audioLabelEl.textContent = 'sound off';
  }
});

/* Unlock on first keydown or scroll too */
document.addEventListener('keydown',  unlockAudio, { once: true });
document.addEventListener('pointerdown', unlockAudio, { once: true });

/* ══════════════════════════════════════════════════════════
   SCROLL
══════════════════════════════════════════════════════════ */
function onScroll() {
  const sy = window.scrollY;
  const vh = window.innerHeight;

  /* Dim background */
  const p = Math.max(0, Math.min(1,
      (sy / vh - FADE_START) / (FADE_END - FADE_START)
  ));
  if (bgReady) {
    bgLayer.style.opacity = (1 - p * (1 - BG_MIN)).toFixed(3);
  }
  overlay.style.background =
      `rgba(var(--overlay-rgb), ${(p * OVERLAY_MAX).toFixed(3)})`;

  /* Fade out hero */
  const heroP = Math.max(0, Math.min(1, (sy / vh) / HERO_FADE_END));
  hero.style.opacity = (1 - heroP).toFixed(3);

  /* Reveal fade-child elements */
  fadeEls.forEach(el => {
    if (el.getBoundingClientRect().top < vh * REVEAL_AT) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();