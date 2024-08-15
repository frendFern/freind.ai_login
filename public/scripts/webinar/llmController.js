
import { youtubeChatController } from "./youtubeChatController.js"
import { openvoiceController } from "./openvoiceController.js"
import { sceneController } from "./sceneController.js";
import { helperFunctions } from "../helper/helper.js";
import { sqsController } from "./sqsController.js";

export const llmController = (function(){

let sceneDrawer = {
    'scene1' : document.getElementById('frend-typing-scene1'),
    'scene2' : document.getElementById('frend-typing-scene2'),
    'scene3' : document.getElementById('frend-typing-scene3')
}
let messageQueue = [];
let messageProcessor = youtubeChatController.getMessageProcessor()

async function callCloudflare(messageObj, resolve) {
    const url = 'https://d2141ekkpgdi0u.cloudfront.net/frend-llm';
    let payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            message: messageObj.message,
            chatHistory:'',
            userid: 'dc4ee603-a5d8-419f-90e8-56390d7dbd8b',
            frendCard: 'neyra.json',
            isCohere: false
        })
    }

    let retryWithOcotoAi = false;

    let data = await fetch(url, payload)
        .then(response => response.json())
        .then(data => {
            if (!data.text){
                retryWithOcotoAi = true;
                throw new Error(data.error || '')
            }
            return data
        })
        .catch(error => {
            console.error("An error has occured when calling cloudflare LLM API." + error + ". Calling OctoAi..")
            retryWithOcotoAi = true;
        });
    
    if (retryWithOcotoAi){
        // Retry with Octoai
        payload =  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                message: messageObj.message,
                chatHistory:'',
                userid: 'dc4ee603-a5d8-419f-90e8-56390d7dbd8b',
                frendCard: 'neyra.json',
                isCohere: true
            })
        }
        await fetch(url, payload)
        .then(response => response.json())
        .then(async data => {
            if (!data.text){
                throw new Error(data.error || 'No data.text')
            }
            // Process LLm response from OctoAI.
            let llmResponse = processString(data.text);

            resolve(llmResponse.cleanString)

        }).catch(error => {
            console.error('Error calling OctoAI LLM:' + error)
            sqsController.sendMessageToSqs('Error occured while calling OctoAi endpoint on llmController')
        });

    }else {
        // Process LLm response from cloudflare.
        let llmResponse = processString(data.text);
        drawResponseToScreen(llmResponse.cleanString, messageObj);

        if(sceneController.getCurrentScene() === 'scene1' || sceneController.getCurrentScene() === 'scene3'){
            await openvoiceController.callVoice(llmResponse.cleanString);
        }
    }
}

function clearResponseOnScreen(scene){
    let divDrawer = sceneDrawer[scene]
    let spanUsername = document.getElementById(`username-${scene}`)
    let spanQuestion = document.getElementById(`frend-question-${scene}`)

    divDrawer.innerHTML = "";
    spanUsername.innerHTML = ""
    spanQuestion.innerHTML = "";
}

async function drawResponseToScreen(llmText, messageObj, currentNirAudioDuration, scene){
   
        let divDrawer = sceneDrawer[scene]
        let spanUsername = document.getElementById(`username-${scene}`)
        let spanQuestion = document.getElementById(`frend-question-${scene}`)

        if(messageObj){
            spanUsername.innerHTML = ""
            spanQuestion.innerHTML = ""
            spanUsername.innerHTML = messageObj.username
            spanQuestion.innerHTML = helperFunctions.truncateString(messageObj.question, 79);
        }
        
        if (llmText.includes("Neyra:")) {
            // Remove "Neyra:" from llmText
            var llmText = llmText.replace(/Neyra:/g, "");
        } 

        divDrawer.innerHTML = llmText;

        let timeoutId;
       async function scrollToBottom(element, currentNirAudioDuration) {

        
            return new Promise((resolve, reject) => {
                
                if (!element || !element.scrollHeight) {

                    return;
                }

                // Calculate the total scrollable height
                const totalHeight = element.scrollHeight;
                
                let scrollSpeed = totalHeight / currentNirAudioDuration;

                element.scrollTop = 0

                // Function to handle the scrolling
               async function scroll() {
                    if (helperFunctions.isScrolledToBottom(element)) {  
                        clearTimeout(timeoutId)
                        resolve();
                        return;
                    }

                    let currentPosition = element.scrollTop;
                    let targetPosition = currentPosition + scrollSpeed * 12; // Adjusting for ~16ms per frame
                    
                    await helperFunctions.sleep((currentNirAudioDuration / scrollSpeed))

                    element.scrollTop = targetPosition;

                    
                    requestAnimationFrame(scroll); // Schedule the next frame
                }
                
                // Start the scrolling after the timeout
                timeoutId = setTimeout(() => {
                    scroll();
                }, 500); // Convert seconds to milliseconds
            });
        }
        
        scrollToBottom(divDrawer, currentNirAudioDuration)
            .then(() => console.log('Scrolled to the bottom'))
            .catch(error => console.error(error.message));
        
    }        

function processString(inputString) {
    // Regular expression to match <draw:{string}> and capture {string}
    const regex = /<drawing:(.*)>/;
    // Use replace() to remove <draw:{string}> and extract {string}
    let modifiedString = inputString.replace(regex, '');
    const match = inputString.match(regex);
    if (!modifiedString){
        modifiedString=match[1]
    }
    let extractedString = null;
    if (match && match[1]) {
        extractedString = match[1]; // Extract {string}
    }else{
        const regex = /drawing\b([^:]*)/i;
        const match = inputString.match(regex);
        
        if (match && match[1]) {
            const prompt = match[1].trim(); // Extract the captured group and trim whitespace
            extractedString = prompt
        } else {
            const regex = /imagine\b(.*)/i;
            const match = inputString.match(regex);
        }
    }
    // Return a JSON object with both the modified string and the extracted {string}
    return {
        cleanString : modifiedString,
        drawingRequest: extractedString
    };
}


function processingText(){
    let span = document.getElementById('frend-typing')
    span.innerHTML = "Processing...";
}

    return {
        messageQueue,
        callCloudflare,
        drawResponseToScreen,
        clearResponseOnScreen
    }

})()
export default llmController