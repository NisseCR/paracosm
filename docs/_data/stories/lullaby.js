const baseUrl = (process.env.BASE_URL || "").replace(/\/$/, "");

const assetUrl = (path) => `${baseUrl}${path}`.replace(/\/{2,}/g, "/");

module.exports = {
    audio: {
        fadeInDurationMs: 5000,
        ambienceTransitionDurationMs: 10000,
        musicFadeOutDurationMs: 5000,
        musicFadeInDurationMs: 5000,
        masterVolume: 1,
        scenes: {
            ambient: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Snow.ogg"), gain: 0.8 }
                ],
            },
            three: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Snow.ogg"), gain: 0.8 }
                ],
                music: {
                    src: assetUrl("/shared/assets/audio/Three.mp3"),
                    gain: 0.2
                }
            }
        }
    }
};