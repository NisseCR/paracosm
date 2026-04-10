export const STORY_AUDIO = {
    fadeInDurationMs: 5000,

    // Separate fade timings for ambience and music.
    ambienceTransitionDurationMs: 5000,
    musicFadeOutDurationMs: 3500,
    musicFadeInDurationMs: 3500,

    masterVolume: 1,

    scenes: {
        intro: {
            ambience: [
                { src: 'assets/audio/Snow.ogg', gain: 0.8 }
            ],
            music: {
                src: 'assets/audio/Homecoming.mp3',
                gain: 0.8
            }
        },

        shore: {
            ambience: [
                { src: 'assets/audio/Rain.ogg', gain: 0.1 }
            ],
            music: {
                src: 'assets/audio/Pandemonium.mp3',
                gain: 0.2
            }
        }
    }
};