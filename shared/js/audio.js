// shared/js/audio.js
export function initAudio({
                              audioBtn,
                              audioLabelEl,
                              audioAmbient,
                              audioMusic,
                              startMuted = false,
                              ambientVolume = 0.55,
                              musicVolume = 0.3
                          }) {
    let audioUnlocked = false;
    let audioOn = !startMuted;

    audioAmbient.volume = ambientVolume;
    audioMusic.volume = musicVolume;

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