import { helperFunctions } from "../helper/helper.js"
import { sceneController } from "./sceneController.js"
import sqsController from "./sqsController.js";

export const openvoiceController = (function(){
   
    var currentNirAudioDuration = 0;
   
    function getCurrentNirAudioDuration(){
        return currentNirAudioDuration
    }

    async function speak(speakURL){

        if(sceneController.getCurrentScene() !== 'scene2'){
            frendGlobalState.speaking=true
   
                try {
                    frendStreamGlobalState.visableModel[0].speak(speakURL)
                    await helperFunctions.sleep(await helperFunctions.getAudioDuration(speakURL))   

                } finally {
                    frendGlobalState.speaking=false
                }
       
        }
    }


    async function callNirVoice(message,resolve) {
        await fetch('http://192.168.0.100:6002',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: message
            })
        })
        .then(response => response.json())
        .then(async data => {
            if (!data.OutputUri){
                throw new Error('No outputuri')
            }
            speakURL = data.OutputUri
            await speak(speakURL)
        })
        .catch(async error => {
            console.error("Neyra TTS failed to execute. " + error + " Calling custom Voice API..");
          return await callVoice(message);
        });
    }
    
      // Function to call Voice
      async function callVoice(message, resolve){
        await fetch(frendGlobalState.frend_api_url + '/frend-tts/tts',{ // host.py
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               text: message,
               style:'default'
            })
        })
        .then(response => response.json())
        .then(async data => {
            if (!data.file){
                throw new Error("No data.file")
            }


            let speakURL = frendGlobalState.frend_api_url + '/frend-tts/' +data.file 
            currentNirAudioDuration = await helperFunctions.getAudioDuration(speakURL)

            return resolve ? resolve({audioDuration: currentNirAudioDuration, speakURL: speakURL, llmResponse:message}) : null;
           
        })
        .catch(error => {
            console.error('Error calling Voice API:', error)
            sqsController.sendMessageToSqs('Error occured while calling frend/tts endpoint on host.py')

        });
    }

    let frendStreamGlobalState
    function init(frendStreamGlobalStateObj){
        frendStreamGlobalState=frendStreamGlobalStateObj
    }

    return {
        getCurrentNirAudioDuration,
        callVoice,
        callNirVoice,
        speak,
        init
    }

})()
export default openvoiceController