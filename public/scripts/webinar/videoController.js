import { helperFunctions } from "../helper/helper.js";
import { sceneController } from './sceneController.js';
import { llmController } from "./llmController.js";

export const videoController = (function(){

    //Control the youtube video
    //Pause, then play


    var player;
    var videoIds = []; 
    var nextVideoIndex = 1; // Start counting from 1 because we're displaying the second video in the playlist
    var videoIndex = 0;
    var videoTitles = {};
    var isCurrentVideoDonePlaying = false;
    var isYoutubeIframeReady = false;

    function onYouTubeIframeAPIReady() {

            player = new YT.Player('player', {
                videoId: videoIds[videoIndex],
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                },
                events: {
                }
            });
    }

    function playVideo(videoId){
        player = new YT.Player('player', {
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
            },
        });

    // Function to initialize event listeners
    function initializeEventListeners(player) {
        player.addEventListener('onReady', onPlayerReady);
        player.addEventListener('onStateChange', onPlayerStateChange);
    }

    // Initialize event listeners for the new player
    initializeEventListeners(player);
    }

    function onPlayerReady(event) {

        if(!isCurrentVideoDonePlaying && sceneController.getCurrentScene() === 'scene2'){
            event.target.loadVideoById(videoIds[videoIndex])
        } else {
            event.target.cueVideoById(videoIds[videoIndex])
            document.getElementById('video-title').textContent = videoTitles[videoIds[videoIndex]].title
            document.getElementById('videoThumbnail').src = videoIndex <= videoIds.length ? videoTitles[videoIds[videoIndex]].thumbnail : ''

        }

        document.getElementById('qr-code').src = videoTitles[videoIds[videoIndex]].qrCode
        
        isCurrentVideoDonePlaying = false;
        isYoutubeIframeReady = true;
    }

    function getIsYoutubeIframeReady(){
        return isYoutubeIframeReady
    }

    function nextVideo() {
        videoIndex += 1;

        if(videoIndex >= videoIds.length){
            videoIndex = 0
        }

    }

    function getVideoIndex()
    {
        return videoIndex
    }

    function getVideoIdsLength(){
        return videoIds.length
    }

    function getVideoId(index){
        return videoIds[index]
    }

    function getCurrentVideoId(){
        return videoIds[videoIndex]
    }

    function getCurrentVideoIntroAndAudioDuration(){
        return {introAudioURL: videoTitles[videoIds[videoIndex]].introAudioURL, 
            introAudioDuration: videoTitles[videoIds[videoIndex]].introAudioDuration,
            introduction: videoTitles[videoIds[videoIndex]].introduction
        }
    }

    function getCurrentVideoQnaIntroAndAudioDuration(){
        return {qnaIntroAudioURL: videoTitles[videoIds[videoIndex]].qnaIntroAudioURL, 
            outroAudioDuration: videoTitles[videoIds[videoIndex]].outroAudioDuration}
    }

    function getCurrentPlayingVideoTitle(){
        return videoTitles[videoIds[videoIndex]].title
    }

    function onPlayerStateChange(event) {
        var data = event.data;
    
        if (data === YT.PlayerState.ENDED) {
          
            isCurrentVideoDonePlaying = true
            llmController.clearResponseOnScreen('scene3')
            sceneController.goToScene('scene3')
        }


    }

    function nextVideoThumbnail(){
        var defaultThumbnail = 'assets/moonshot.png';
        var nextVideoId = videoIds[nextVideoIndex];
        var nextVideoInfo = videoTitles[nextVideoId];
        var nextVideoTitle = nextVideoInfo ? nextVideoInfo.title : "Unknown Title";
        var nextVideoThumbnail = nextVideoInfo ? nextVideoInfo.thumbnail : defaultThumbnail;

        document.getElementById("nextVideoTitle").innerHTML = "<b>Coming Next:</b> " + nextVideoTitle;
        document.getElementById("nextVideoThumbnail").src = nextVideoThumbnail;

    }

    function init(videoObj){
        videoIds = videoObj.videoIds
        videoTitles = videoObj.videoTitles
    }



    return {
        nextVideo,
        playVideo,
        getCurrentVideoId,
        getCurrentPlayingVideoTitle,
        getCurrentVideoIntroAndAudioDuration,
        getCurrentVideoQnaIntroAndAudioDuration,
        getVideoIdsLength,
        getVideoId,
        onPlayerReady,
        getVideoId,
        getVideoIndex,
        getIsYoutubeIframeReady,
        onYouTubeIframeAPIReady,
        onPlayerStateChange,
        init
    }
})();

export default videoController