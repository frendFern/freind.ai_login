import { helperFunctions } from "../helper/helper.js";
import { videoController } from "./videoController.js";
import { openvoiceController } from "./openvoiceController.js";
import { llmController } from "./llmController.js";
import { currentWebinar } from "../constants/constants.js";
import { observerController } from "./observer.js";
import { animationController } from "./animationController.js"
import youtubeChatController from "./youtubeChatController.js";
import { questionController } from "./questionController.js";
import { EventBus } from "./eventsController.js";

export const sceneController = (function(){

    // Change between scenes
        // Intro
        // Video play
        // QA focused
    // 
    const eventBus = new EventBus();

    var messageProcessor = youtubeChatController.getMessageProcessor()
    var canProceedToNextVideo = false;
    var currentScene = 'scene1';
    let intervalIdForQnaChecking;

    function getCurrentScene()
    {
        return currentScene
    }

    function setCurrentScene(scene){
        currentScene = scene
    }

    eventBus.on('dataLoaded', data => {
        console.log('Component A received data:', data);
    });
    function goToScene(scene){

        let avatar = document.getElementById("frend-canvas")
        let mainContent = document.getElementById("main-content")

        let countdownTimerContainer = document.querySelector(".countdown-timer-container")
        let bottomContentHeader = document.querySelector(".bottom-content-header")
        let avatarContainer = document.querySelector(".model-container")
        let nextVideoThumbnailContainer = document.querySelector(".top-half")
        let player = document.getElementById("player")       
        let playerContainer = document.getElementById('player-container') 
        let nextVideoTimerContainer = document.getElementById("next-video-timer-container")
        let nextVideoTimer = document.getElementById('next-video-timer')

        switch (scene) {
            case "scene1":
                scene1(avatar, mainContent, countdownTimerContainer, 
                        avatarContainer, player, playerContainer,
                        nextVideoTimerContainer, nextVideoTimer)
                break;
            
            case "scene2":
                scene2(avatar, mainContent, countdownTimerContainer, avatarContainer, 
                    bottomContentHeader, nextVideoThumbnailContainer, player, 
                    playerContainer)
                break;
            case "scene3":
                scene3(avatar, mainContent, countdownTimerContainer, avatarContainer, 
                    player, playerContainer, nextVideoTimerContainer)
                break;
            default:
                break;
        }



    }

    async function scene1(avatar, mainContent, countdownTimerContainer,
                    avatarContainer, player, playerContainer, 
                    nextVideoTimerContainer, nextVideoTimer) {

        const refLeft = mainContent.getBoundingClientRect().left - 495;
        const refBottomY = mainContent.getBoundingClientRect().top + 58;
    
        setCurrentScene('scene1')
        switchFrendTypingScene('scene1')
        messageProcessor.setQnaOnHold(true)
    
        document.getElementById('video-start-text').textContent = videoController.getVideoIndex() === 0 ? 'Video Starts In: ' : 'Next Video Starts In'
        document.getElementById('sub-content').style.display = 'flex'

        avatarContainer.style.display = "none"
        avatar.style.height = "600px";
        avatar.style.transform = `translate(${refLeft}px, ${refBottomY}px)`

        countdownTimerContainer.style.display = 'none'
        nextVideoTimerContainer.style.display = 'flex'

        player.style.position = "relative"
        player.style.height = "300px"
        player.style.width = "500px"

        mainContent.style.flexDirection = 'row-reverse'
        mainContent.appendChild(avatar)
        playerContainer.appendChild(player)

        document.getElementById('sub-content').appendChild(nextVideoTimerContainer)
        document.getElementById('sub-content').appendChild(playerContainer)

        videoIntroduction(nextVideoTimer)

    }

    function scene2(avatar, mainContent, countdownTimerContainer, avatarContainer, 
        bottomContentHeader, nextVideoThumbnailContainer, player, playerContainer) {
        const refLeft = avatarContainer.getBoundingClientRect().left;
        const refBottomY = avatarContainer.getBoundingClientRect().bottom;
    
        setCurrentScene('scene2')
        eventBus.emit('dataLoaded', { message: 'Data loaded successfully!' });
        switchFrendTypingScene('scene2')

        messageProcessor.setQnaOnHold(false)

        avatar.style.height = "300px";
        avatar.style.transform = `translate(${refLeft - 70}px, ${refBottomY}px)`

        player.style.position = "absolute"
        player.style.height = "100%"
        player.style.width = "100%"
        player.style.marginTop = "0px"
        
        countdownTimerContainer.style.display = 'flex'

        avatarContainer.style.display = 'flex'
        bottomContentHeader.style.display = "flex"

        nextVideoThumbnailContainer.style.display = "flex"

        var observer = new MutationObserver(observerController.handleMutations)
        observer.observe(mainContent,observerController.config)

        mainContent.appendChild(player)
        avatarContainer.appendChild(avatar)

        playerContainer.style.display = 'none'

        //check qna queue if no queue static question will be processed
        checkForQuestions()
    }

   async function scene3(avatar, mainContent, countdownTimerContainer, avatarContainer,
         player, playerContainer, nextVideoTimerContainer) {
        
            let qnaHistoryArray = messageProcessor.filterQnaHistory()
        const refLeft = mainContent.getBoundingClientRect().left - 495;
        const refBottomY = mainContent.getBoundingClientRect().top + 58;
    
        setCurrentScene('scene3')
        switchFrendTypingScene('scene3')
        clearInterval(intervalIdForQnaChecking);


        canProceedToNextVideo = false
        messageProcessor.setQnaOnHold(true)

        document.getElementById('video-start-text').textContent = 'Q&A ends in: '

        avatar.style.transform = `translate(${refLeft}px, ${refBottomY}px)`
        playerContainer.style.display = 'flex'
        avatarContainer.style.display = "none"

        avatar.style.height = "600px";
        avatar.style.transform = "translate(80px, 78px)"

        countdownTimerContainer.style.display = 'none'

        player.style.position = "relative"
        player.style.height = "300px"
        player.style.width = "500px"

        mainContent.style.flexDirection = 'row'


        mainContent.appendChild(avatar)
        playerContainer.appendChild(player)
        document.getElementById('sub-content').appendChild(nextVideoTimerContainer)
        document.getElementById('sub-content').appendChild(playerContainer)

        timerToNextVideo(messageProcessor)

        await new Promise(async function(resolve, reject){
           await qnaIntro()
           await processQnaHistory(qnaHistoryArray)
           await processQuestionForSceneThree(messageProcessor)
            resolve()
        }).then(result => {
            videoController.nextVideo()
            llmController.clearResponseOnScreen('scene1')
            canProceedToNextVideo = true
        })



    }
    async function checkForQuestions() {
        let question = [...currentWebinar.videoTitles[currentWebinar.videoIds[videoController.getVideoIndex()]]['staticQuestions']].slice(0,2);
    
        // Define processQuestion as an async function to allow await inside it
        async function processQuestion() {
            let intervalIdForQnaChecking; // Declare intervalIdForQnaChecking inside processQuestion
    
            return new Promise((resolve, reject) => {
                try {
                    intervalIdForQnaChecking = setInterval(async () => { // Use async arrow function to allow await inside setInterval
                        try {
                            await questionController.checkMessageQueue(question);
                            console.log('checkMessageQueueCalled');
                            
                            // Check if the question array is still not empty
                            if (question.length > 0) {
                                // Recursively call the function to continue processing questions
                                processQuestion().then(resolve).catch(reject);
                            } else {
                                clearInterval(intervalIdForQnaChecking); // Clear the interval if no more questions
                                resolve(); // Resolve the promise
                                return;
                            }
                        } catch (error) {
                            console.error(error);
                            clearInterval(intervalIdForQnaChecking); // Clear the interval on error
                            reject(error); // Reject the promise with the error
                        }
                    }, 30000); // Set the interval to run every 30 seconds
                } catch (error) {
                    console.error(error);
                    clearInterval(intervalIdForQnaChecking); // Clear the interval on error
                    reject(error); // Reject the promise with the error
                }
            });
        }
    
        // Call processQuestion and wait for its completion
        await processQuestion();

        return;
    }



    async function videoIntroduction(nextVideoTimer) {

        return await new Promise(async function(resolve, reject){
                if(frendGlobalState.cached){
                    let introCachedAudio = videoController.getCurrentVideoIntroAndAudioDuration()
                    await helperFunctions.sleep(1)
                    resolve({audioDuration: introCachedAudio.introAudioDuration, speakURL: introCachedAudio.introAudioURL})
                    await openvoiceController.speak(introCachedAudio.introAudioURL)
                }else{
                    openvoiceController.callVoice(currentWebinar.videoTitles[currentWebinar.videoIds[videoController.getVideoIndex()]]['introduction'], resolve)
                }
            })
            .then(async result => {
                await drawNirResponseAndSpeak(currentWebinar.videoTitles[currentWebinar.videoIds[videoController.getVideoIndex()]]['introduction'], result.speakURL, result.audioDuration, nextVideoTimer)
            })
    }

    async function drawNirResponseAndSpeak(introduction, speakURL, audioDuration, nextVideoTimer)
    {
       return await Promise.all([
            new Promise(async (resolve, reject) => {
                llmController.drawResponseToScreen(introduction, null, audioDuration, 'scene1')
                resolve()
            }),
           await new Promise(async (resolve, reject) => {
               await openvoiceController.speak(speakURL)
               resolve()
            }),
        ]).then(async result => {
            await helperFunctions.startCountdown(5,nextVideoTimer)
            llmController.clearResponseOnScreen('scene2')
            goToScene('scene2')
        })
    }

    async function qnaIntro(){

          return  await new Promise(async function(resolve, reject){
                if(frendGlobalState.cached){
                    let introCachedAudio = videoController.getCurrentVideoQnaIntroAndAudioDuration()
                    await helperFunctions.sleep(0.5)
                    resolve({audioDuration: introCachedAudio.outroAudioDuration, speakURL: introCachedAudio.qnaIntroAudioURL})
                    await openvoiceController.speak(introCachedAudio.qnaIntroAudioURL)
                }{
                    openvoiceController.callVoice(currentWebinar.videoTitles[currentWebinar.videoIds[videoController.getVideoIndex()]]['qnaIntro'], resolve)
                }
            })
            .then(async result => {
                await new Promise(async (resolve, reject) => {
                    llmController.drawResponseToScreen(currentWebinar.videoTitles[currentWebinar.videoIds[videoController.getVideoIndex()]]['qnaIntro'], null, result.audioDuration, 'scene3')    
                    await openvoiceController.speak(result.speakURL)

                    resolve()
                    })

            })
    }

   async function processQuestionForSceneThree(messageProcessor){
        let sceneThreeQnaArray = messageProcessor.queue.slice(0,20)

        return await new Promise(async (resolve, reject) => {
            for (const message of sceneThreeQnaArray) {
                let qnaPromise = new Promise(async (resolve, reject) => {
                    try {
                        await llmController.callCloudflare({message: message.message, username: message.username, question: message.question}, resolve)
                    } catch (error) {
                    }
                }).then(async result => {
                    await new Promise(async (resolve, reject) => {
                        await openvoiceController.callVoice(result, resolve)
                        }).then(async result =>{
                            llmController.drawResponseToScreen(result.llmResponse, {message: message.message, username: message.username, question: message.question}, result.audioDuration, 'scene3')
                            await openvoiceController.speak(result.speakURL)
                            console.log(sceneThreeQnaArray.length);
                            
                    })
                })
            
                await qnaPromise
            }
            resolve()
        })


   }


   async function processQnaHistory(qnaHistoryArray){

        return await new Promise(async (resolve, reject) => {
            
            if (qnaHistoryArray.length === 0){
                resolve()
            }else{
                const message = qnaHistoryArray.shift();
                await helperFunctions.sleep(1)
                await llmController.drawResponseToScreen(message.llmResponse, message.messageObj, message.audioDuration, 'scene3')
                await openvoiceController.speak(message.speakURL)
    
                resolve(processQnaHistory(qnaHistoryArray))
             
            }

  
        })
 
    }

    function timerToNextVideo(messageProcessor){

        return new Promise(async (resolve, reject) => {
            await helperFunctions.startCountdown(5,document.getElementById('next-video-timer'))

            if(!canProceedToNextVideo){
                timerToNextVideo(messageProcessor)
            }else{
                messageProcessor.qnaHistoryQueue = []
                messageProcessor.queue = []
                messageProcessor.qnaProcessCountForSceneThree = 0

                resolve()
                goToScene('scene1')
            }
        })

    }

    function switchFrendTypingScene(scene){
        switch (scene) {
            case 'scene1':
                document.getElementById('username-scene3').style.display = 'none'
                document.getElementById('frend-question-scene3').style.display = 'none'

                document.getElementById('frend-typing-scene1').style.display = 'flex'
                document.getElementById('frend-typing-scene2').style.display = 'none'
                document.getElementById('frend-typing-scene3').style.display = 'none'
                break;
            case 'scene2':
                document.getElementById('username-scene2').style.display = 'flex'
                document.getElementById('frend-question-scene2').style.display = 'flex'
                document.getElementById('username-scene3').style.display = 'none'
                document.getElementById('frend-question-scene3').style.display = 'none'

                document.getElementById('frend-typing-scene1').style.display = 'none'
                document.getElementById('frend-typing-scene2').style.display = 'flex'
                document.getElementById('frend-typing-scene3').style.display = 'none'
                break;
            case 'scene3':
                document.getElementById('username-scene2').style.display = 'none'
                document.getElementById('frend-question-scene2').style.display = 'none'
                document.getElementById('username-scene3').style.display = 'flex'
                document.getElementById('frend-question-scene3').style.display = 'flex'

                document.getElementById('frend-typing-scene1').style.display = 'none'
                document.getElementById('frend-typing-scene2').style.display = 'none'
                document.getElementById('frend-typing-scene3').style.display = 'flex'
                break;
        
            default:
                break;
        }
    }

    return{
        goToScene,
        getCurrentScene,
        setCurrentScene
    }  
})();

export default sceneController