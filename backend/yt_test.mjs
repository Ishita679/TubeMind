import ytdl from '@distube/ytdl-core';

async function test(videoId) {
    try {
        console.log('Testing:', videoId);
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
        const tracks = info.player_response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        console.log('tracks found:', tracks?.length ?? 0);
        if (tracks?.length) {
            const track = tracks.find(t => t.languageCode === 'en') || tracks[0];
            console.log('en track baseUrl:', track.baseUrl.substring(0, 80));
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test('arj7oStGLkU');
