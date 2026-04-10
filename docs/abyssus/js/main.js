import {
    LABEL_TEXT,
    TITLE_TEXT,
    LABEL_SPEED,
    TITLE_SPEED,
    TITLE_DELAY,
    INTRO_DELAY,
} from './config.js';

import { typeInto } from './typewriter.js';
import { initAudioControls } from './audio.js';
import { initScrollEffects } from './scroll.js';

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

setTimeout(() => {
    typeInto(labelEl, LABEL_TEXT, LABEL_SPEED, () => {
        setTimeout(() => {
            typeInto(titleEl, TITLE_TEXT, TITLE_SPEED, null);
        }, TITLE_DELAY);
    });
}, INTRO_DELAY);

initAudioControls({
    audioBtn,
    audioLabelEl,
    audioAmbient,
    audioMusic,
});

initScrollEffects({
    bgLayer,
    overlay,
    hero,
    fadeEls,
});