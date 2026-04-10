import { AUDIO_AMBIENT_VOLUME, AUDIO_MUSIC_VOLUME } from './config.js';

export function initAudioControls({
                                      audioBtn,
                                      audioLabelEl,
                                      audioAmbient,
                                      audioMusic,
                                  }) {
    let audioUnlocked = false;
    let audioOn = true;

    audioAmbient.volume = AUDIO_AMBIENT_VOLUME;
    audioMusic.volume = AUDIO_MUSIC_VOLUME;

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
            unlockAudio();
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

    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('pointerdown', unlockAudio, { once: true });
}