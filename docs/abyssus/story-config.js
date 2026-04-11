export const STORY_AUDIO = {
    fadeInDurationMs: 5000,

    // Separate fade timings for ambience and music.
    ambienceTransitionDurationMs: 10000,
    musicFadeOutDurationMs: 5000,
    musicFadeInDurationMs: 5000,

    masterVolume: 1,

    scenes: {
        intro: {
            ambience: [
                { src: 'assets/audio/Snow.ogg', gain: 0.8 }
            ],
            music: {
                src: 'assets/audio/Homecoming.mp3',
                gain: 0.6
            }
        },

        shore: {
            ambience: [
                { src: 'assets/audio/Rain.ogg', gain: 0.1 }
            ],
            music: {
                src: 'assets/audio/Pandemonium.mp3',
                gain: 0.1
            }
        },

        ship: {
            ambience: [
                { src: 'assets/audio/Ship.ogg', gain: 0.4 }
            ],
            music: {
                src: 'assets/audio/Witcher.mp3',
                gain: 0.2
            }
        }
    }
};