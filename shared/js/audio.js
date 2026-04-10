// shared/js/audio.js
export function initAudio({
                              audioBtn,
                              audioLabelEl,
                              audioAmbient,
                              audioMusic,
                              startMuted = false,
                              ambientVolume = 0.55,
                              musicVolume = 0.3,
                              fadeDuration = 5000
                          }) {
    let audioUnlocked = false;
    let audioOn = !startMuted;
    let fadeAnimationId = null;
    let shouldFadeInOnUnlock = true;

    audioAmbient.volume = 0;
    audioMusic.volume = 0;

    audioBtn.classList.add('visible');

    function setButtonState(isOn) {
        audioBtn.classList.toggle('muted', !isOn);
        audioLabelEl.textContent = isOn ? 'sound on' : 'sound off';
    }

    function stopFade() {
        if (fadeAnimationId !== null) {
            cancelAnimationFrame(fadeAnimationId);
            fadeAnimationId = null;
        }
    }

    function fadeTo(targetAmbientVolume, targetMusicVolume, shouldPauseOnEnd = false, onComplete) {
        stopFade();

        const startTime = performance.now();
        const startAmbientVolume = audioAmbient.volume;
        const startMusicVolume = audioMusic.volume;

        function tick(now) {
            const progress = Math.min((now - startTime) / fadeDuration, 1);

            audioAmbient.volume = startAmbientVolume + (targetAmbientVolume - startAmbientVolume) * progress;
            audioMusic.volume = startMusicVolume + (targetMusicVolume - startMusicVolume) * progress;

            if (progress < 1) {
                fadeAnimationId = requestAnimationFrame(tick);
                return;
            }

            fadeAnimationId = null;

            if (shouldPauseOnEnd) {
                audioAmbient.pause();
                audioMusic.pause();
            }

            if (typeof onComplete === 'function') {
                onComplete();
            }
        }

        fadeAnimationId = requestAnimationFrame(tick);
    }

    function startAudio(shouldFade = false) {
        if (shouldFade) {
            audioAmbient.volume = 0;
            audioMusic.volume = 0;
        } else {
            audioAmbient.volume = ambientVolume;
            audioMusic.volume = musicVolume;
        }

        audioAmbient.play().catch(() => {});
        audioMusic.play().catch(() => {});

        if (shouldFade) {
            fadeTo(ambientVolume, musicVolume);
        }
    }

    function stopAudio() {
        audioAmbient.volume = 0;
        audioMusic.volume = 0;
        audioAmbient.pause();
        audioMusic.pause();
    }

    function unlockAudio() {
        if (audioUnlocked) return;
        audioUnlocked = true;

        if (audioOn) {
            setButtonState(true);
            startAudio(shouldFadeInOnUnlock);
            shouldFadeInOnUnlock = false;
        }
    }

    audioBtn.addEventListener('click', () => {
        if (!audioUnlocked) {
            unlockAudio();
            return;
        }

        audioOn = !audioOn;

        if (audioOn) {
            setButtonState(true);
            startAudio(false);
        } else {
            setButtonState(false);
            stopAudio();
        }
    });

    document.addEventListener('keydown', unlockAudio, { once: true });
    document.addEventListener('pointerdown', unlockAudio, { once: true });
}