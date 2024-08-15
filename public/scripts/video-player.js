const adDoneButton = document.getElementById('ad-done-button')

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'Xh-fkc5clWI',
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'disablekb': 1,
      'rel': 0,
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    adDoneButton.classList.remove('hidden');
  }else if (event.data == YT.PlayerState.PLAYING && !done) {
    // Play ad for 60s
    setTimeout(stopVideo, 60000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
  adDoneButton.classList.remove('hidden');
}



