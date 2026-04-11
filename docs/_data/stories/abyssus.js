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
            intro: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Snow.ogg"), gain: 0.8 }
                ],
                music: {
                    src: assetUrl("/shared/assets/audio/Homecoming.mp3"),
                    gain: 0.6
                }
            },
            shore: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Rain.ogg"), gain: 0.1 }
                ],
                music: {
                    src: assetUrl("/shared/assets/audio/Pandemonium.mp3"),
                    gain: 0.1
                }
            },
            ship: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Ship.ogg"), gain: 0.4 }
                ],
                music: {
                    src: assetUrl("/shared/assets/audio/Witcher.mp3"),
                    gain: 0.2
                }
            },
            creepy: {
                ambience: [
                    { src: assetUrl("/shared/assets/audio/Watchtower.ogg"), gain: 1.0 }
                ],
                music: {
                    src: assetUrl("/shared/assets/audio/Pandemonium.mp3"),
                    gain: 0.05
                }
            }
        }
    }
};