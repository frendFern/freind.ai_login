

var player;
var videoIds = ['rkc5_LWGDz0', '1r1vRDVzyac', 'bNXIsSh3dFQ','WJwVFnhPgxY']; 
var playlistString = videoIds.join(',');
var nextVideoIndex = 1; // Start counting from 1 because we're displaying the second video in the playlist

//dictionary to map video id's to titles
// var videoTitles = {
//     'rkc5_LWGDz0': 'How to craft the PERFECT investor email (startup venture capital and angel investors)',
//     '1r1vRDVzyac': 'Venture Capital "Moonshot" Startup Investment Strategy (versus angel investment strategy)',
//     'bNXIsSh3dFQ': 'Top 5 mistakes in startup fundraising (raising venture capital)',
//     'WJwVFnhPgxY': 'Startup Investment Is An Emotional Decision (venture capital fundraising tips)'
// };

var videoTitles = {
    'rkc5_LWGDz0': {
        title: 'How to craft the PERFECT investor email (startup venture capital and angel investors)',
        thumbnail: 'assets/how-to-craft-thumbnail.png'
    },
    '1r1vRDVzyac': {
        title: 'Venture Capital "Moonshot" Startup Investment Strategy (versus angel investment strategy)',
        thumbnail: 'assets/moonshot.png'
    },
    'bNXIsSh3dFQ': {
        title: 'Top 5 mistakes in startup fundraising (raising venture capital)',
        thumbnail: 'assets/top5.png'
    },
    'WJwVFnhPgxY': {
        title: 'Startup Investment Is An Emotional Decision (venture capital fundraising tips)',
        thumbnail: 'assets/emotional.png'
    }
};


function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {

        videoId: videoIds[0],
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'playlist': playlistString,
            'loop': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    var data = event.data;
    console.log("Player state changed: " + data);

    if (data === YT.PlayerState.ENDED || data === -1) {
        nextVideoIndex++;
        if (nextVideoIndex > videoIds.length) {
            nextVideoIndex = 1; //loop back to the first video
        }

        var defaultThumbnail = 'assets/moonshot.png';
        var nextVideoId = videoIds[nextVideoIndex - 1];
        var nextVideoInfo = videoTitles[nextVideoId];
        var nextVideoTitle = nextVideoInfo ? nextVideoInfo.title : "Unknown Title";
        var nextVideoThumbnail = nextVideoInfo ? nextVideoInfo.thumbnail : defaultThumbnail;

        document.getElementById("nextVideoTitle").innerHTML = "<b>Coming Next:</b> " + nextVideoTitle;
        document.getElementById("nextVideoThumbnail").src = nextVideoThumbnail;
    }
}