---
layout: chapter.njk
storySlug: abyssus
chapterSlug: chapter-2
title: Abyssus
chapterLabel: Prologue · Abyssus
heroTitle: End
bodyClass: chapter-2-page
storyBase: /stories/abyssus/

bgVideos:
  - id: bg-video-study
    src: /shared/assets/video/house-night.webm
    type: video/webm
  - id: bg-video-lens-warm
    src: /shared/assets/video/lens-warm.webm
    type: video/webm
    
audio:
  fadeInDurationMs: 5000
  ambienceTransitionDurationMs: 10000
  musicFadeOutDurationMs: 5000
  musicFadeInDurationMs: 5000
  scenes:
    baby:
      ambience:
        - src: /shared/assets/audio/ambience/snow.ogg
          gain: 0.6
      music:
        src: /shared/assets/audio/music/baby.mp3
        gain: 0.4

nav:
  previous:
    label: Previous
    url: /stories/abyssus/chapters/chapter-1/
  next: null
---

{% audio "baby" %}

