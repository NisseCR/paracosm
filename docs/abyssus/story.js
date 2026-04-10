export const STORY_AUDIO = {
    // How far apart paragraph anchors should feel during blending.
    // Larger values make transitions more gradual across scroll distance.
    blendWindowPx: 700,

    // If true, the music system crossfades between adjacent scenes.
    // Ambience can always blend simultaneously.
    musicCrossfade: true,

    // Default volume scaling for the whole story.
    masterVolume: 1,

    // Scene definitions keyed by the value of data-audio-step.
    scenes: {
        intro: {
            ambience: [
                { src: 'assets/audio/Snow.ogg', gain: 0.8 }
            ],
            music: 'assets/audio/Homecoming.mp3'
        },

        shore: {
            ambience: [
                { src: 'assets/audio/Rain.ogg', gain: 0.8 }
            ],
            music: 'assets/audio/Pandemonium.mp3'
        }

        // cavern: {
        //     ambience: [
        //         { src: 'assets/audio/LowRumble.ogg', gain: 0.6 },
        //         { src: 'assets/audio/Drips.ogg', gain: 0.4 }
        //     ],
        //     music: 'assets/audio/CavernTheme.mp3'
        // }
    }
};