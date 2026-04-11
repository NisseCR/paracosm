import { initStoryPage } from '../../shared/js/story-page.js';

function readStoryAudioConfig() {
  const el = document.getElementById('story-audio-config');
  if (!el) return {};

  try {
    return JSON.parse(el.textContent || '{}');
  } catch (error) {
    console.error('Failed to parse story audio config:', error);
    return {};
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const storyAudio = readStoryAudioConfig();
  initStoryPage(storyAudio);
});