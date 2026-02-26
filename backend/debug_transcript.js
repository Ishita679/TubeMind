import { getTranscript } from './src/services/transcriptService.js';

(async () => {
  const ids = [
    'dQw4w9WgXcQ', // rickroll: no captions
    'M7lc1UVf-VE', // official YouTube API sample video (should have captions)
    'EwTZ2xpQwpA', // Charlie bit me (probably no captions)
  ];

  for (const id of ids) {
    try {
      console.log(`=== testing ${id}`);
      const text = await getTranscript(id);
      console.log('result length', text ? text.length : text, 'output:', text ? text.slice(0,100) : text);
    } catch (e) {
      console.error('error for', id, e.message);
    }
  }
})();
