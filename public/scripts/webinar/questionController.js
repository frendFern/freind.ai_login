import youtubeChatController from "./youtubeChatController.js";

export const questionController = (function(){

    var messageProcessor = youtubeChatController.getMessageProcessor()
 
    function checkMessageQueue(question) {
        return new Promise((resolve, reject) => {
          if (messageProcessor.queue.length === 0 && question.length > 0) {

            //process question
            messageProcessor.enqueueMessage(question.shift())


          } 

            //resolve the promise
            resolve();
            
        });
      }

    return {
        checkMessageQueue
    }
})()