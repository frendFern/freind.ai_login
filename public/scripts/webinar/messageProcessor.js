import helperFunctions from "../helper/helper.js";
import llmController from "./llmController.js";
import openvoiceController from "./openvoiceController.js";
import qnadataController from "./qnaDataController.js";
import sceneController from "./sceneController.js";
import videoController from "./videoController.js";
import sqsController from "./sqsController.js";

export class MessageProcessor {
    constructor() {
        this.qnaHistoryQueue = [];
        this.queue = [];
        this.inProcess = false;
        this.isQnaOnHold = false;
        this.qnaProcessCountForSceneThree = 0;
    }

    processMessagesOnIdlePeriod(deadline){
        while(deadline.timeRemaining() > 0 && this.queue.length > 0){
            this.processMessages()
        }

        if(this.queue.length > 0){
            requestIdleCallback(this.processMessagesOnIdlePeriod)
        }
    }
    
    setInProcess(value){
        this.inProcess = value
    }

    setQnaOnHold(value){
        this.isQnaOnHold = value
    }

    enqueueMessage(message){
        this.queue.push(message);
        this.processMessages();
    }

    enqueueQnaHistory(qnaData){
        this.qnaHistoryQueue.push(qnaData)
    }

    filterQnaHistory(){
        return this.qnaHistoryQueue.filter(item => item.scene === 'scene2')
    }

    async processMessages(){

        if (this.inProcess || this.queue.length === 0 || this.isQnaOnHold) return;

        this.inProcess = true;
        const message = this.queue.shift();

        try {
            await new Promise(async function(resolve, reject){
            await llmController.callCloudflare(message, resolve)   
          }).then(result =>{
            new Promise(async (resolve,reject) => {
                openvoiceController.callVoice(result,resolve)
           }).then(async result => {
              llmController.drawResponseToScreen(result.llmResponse, message, result.audioDuration, 'scene2')
              
              this.enqueueQnaHistory({
                   'llmResponse': result.llmResponse,
                   'messageObj': message,
                   'scene': sceneController.getCurrentScene(),
                   'speakURL': result.speakURL,
                   'audioDuration': result.audioDuration
               })


           })
          })  
          
 

            if(sceneController.getCurrentScene() === 'scene2'){
                let countDownTimer = document.getElementById('countdown-timer')

               await helperFunctions.startCountdown(10, countDownTimer)

            } 

        } catch (error) {   
            sqsController.sendMessageToSqs(`An error occured on the message processor ${error}`)
        } finally  {
            this.inProcess = false;
            this.processMessages();
        }
    }


}