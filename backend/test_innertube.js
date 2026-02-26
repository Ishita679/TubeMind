import { Innertube } from 'youtubei.js';

(async () => {
  try {
    const yt = await Innertube.create({ retrieve_player: false });
    console.log('created innertube');
    const info = await yt.getInfo('EwTZ2xpQwpA');
    console.log('got info');
    const data = await info.getTranscript();
    console.log('transcript raw', JSON.stringify(data).slice(0,200));
  } catch (e) {
    console.error('err', e.message);
  }
})();
