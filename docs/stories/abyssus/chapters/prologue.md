---
layout: chapter.njk
title: Abyssus
chapterLabel: Prologue · Abyssus
heroTitle: Falling Colour
bodyClass: prologue-page
storyBase: /stories/abyssus/

bgVideos:
  - id: bg-video-wind
    src: /shared/assets/video/wind.webm
    type: video/webm
  - id: bg-video-mountain
    src: /shared/assets/video/mountain.webm
    type: video/webm
    
audio:
  fadeInDurationMs: 5000
  ambienceTransitionDurationMs: 10000
  musicFadeOutDurationMs: 5000
  musicFadeInDurationMs: 5000
  scenes:
    intro:
      ambience:
        - src: /shared/assets/audio/ambience/snow.ogg
          gain: 0.8
      music:
        src: /shared/assets/audio/music/homecoming.mp3
        gain: 0.6
    creepy:
      ambience:
        - src: /shared/assets/audio/ambience/watchtower.ogg
          gain: 1
      music:
        src: /shared/assets/audio/music/pandemonium.mp3
        gain: 0.05
        
nav:
  previous: null
  next:
    label: Next
    url: /stories/abyssus/chapters/chapter-1/
---

{% audio "intro" %}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.

{% ruler %}

{% audio "creepy" %}

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.
Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.