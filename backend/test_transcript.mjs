import { YoutubeTranscript } from 'youtube-transcript';

const videoId = process.argv[2] || 'kCc8FmEb1nY';
console.log('Testing videoId:', videoId);

try {
    const items = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' });
    console.log('SUCCESS - items count:', items.length);
    if (items.length > 0) {
        console.log('First item:', items[0]);
    }
} catch (e) {
    console.error('youtube-transcript ERROR:', e.message);
    // Try without lang
    try {
        const items2 = await YoutubeTranscript.fetchTranscript(videoId);
        console.log('No-lang SUCCESS - items count:', items2.length);
    } catch (e2) {
        console.error('No-lang ERROR:', e2.message);
    }
}
