import { initStoryPage } from '../../shared/js/story-page.js';

function readChapterAudioConfig() {
  const el = document.getElementById('chapter-audio-config');
  if (!el) return {};

  try {
    return JSON.parse(el.textContent || '{}');
  } catch (error) {
    console.error('Failed to parse chapter audio config:', error);
    return {};
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chapterAudio = readChapterAudioConfig();
  initStoryPage(chapterAudio);
});