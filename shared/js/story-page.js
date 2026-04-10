// shared/js/story-page.js
import { typeInto } from './typewriter.js';
import { initAudio } from './audio.js';
import { initStoryEffects } from './effects.js';

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

typeInto(labelEl, 'Prologue · Abyssus', 55, () => {
    setTimeout(() => {
        typeInto(titleEl, 'Falling Colour', 90);
    }, 380);
});

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