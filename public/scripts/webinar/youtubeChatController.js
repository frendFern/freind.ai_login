import { llmController } from "./llmController.js"
import { helperFunctions } from "../helper/helper.js"
import { MessageProcessor } from "./messageProcessor.js"
import sceneController from "./sceneController.js";
import videoController from "./videoController.js";
import sqsController from "./sqsController.js";

export const youtubeChatController = (function(){

    const socketAddress = 'wss://youtube-websocket.danny-5e7.workers.dev/s/';
    const processor = new MessageProcessor();

    //SOCKET based youtube:
    function WebsocketChat(){
        function getTimestampInSeconds () {
            return Math.floor(Date.now() / 1000)
          }

        function embedYoutubeChat(chatid){
            let youtubeIframeAddress = `https://www.youtube.com/live_chat?v=${chatid}&embed_domain=localhost&dark_theme=1`;
            let emebeddedYoutubeChat = document.getElementById('chat')

            emebeddedYoutubeChat.src = youtubeIframeAddress
        }

        let currentTime = getTimestampInSeconds()
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('chatid')){
            let chatid = searchParams.get('chatid')
            let currentStream  = socketAddress+chatid
            let socket = new WebSocket(currentStream);

            embedYoutubeChat(chatid)

            const ping_interval = 120000; //keep link alive
            // Connection opened
            const sendMessage = JSON.stringify({ping:1});
            let interval
            socket.addEventListener('open', function (event) {
                // Send a message to the server
                socket.send(sendMessage);
                interval = setInterval(()=>{
                    console.log(sendMessage)
                    socket.send(sendMessage);
                }, ping_interval)
            });
            // Listen for messages
            socket.addEventListener('message', function (event) {
                let eventDataJson = JSON.parse(event.data)

                if (currentTime < eventDataJson.unix){
                    let data = {
                        user_id:eventDataJson.author.name,
                        message:eventDataJson.message
                    }
                    
                    queueNextMessage(data)

                }
                else{
                    console.log('Ignoring old message')
                }
            });
            socket.addEventListener('close', function (event) {
                console.log('WebSocket is closed now.');
                clearInterval(interval);
                setTimeout(function(){WebsocketChat()},1000)
            });
            
            
            // Error handling
            socket.addEventListener('error', function (event) {
                console.error('WebSocket error: ', event);
                sqsController.sendMessageToSqs(`Websocket error on youtube livechat ${event}`)
                clearInterval(interval);
                setTimeout(function(){WebsocketChat()},1000)
            });
        }
    }
    WebsocketChat()



    function updateCurrentDrawComment(chatObj){
        let chatBlock = `<span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span>` 
        let chatArea = document.getElementById('frend-holder-current-comment-draw')
        chatArea.innerHTML = chatBlock;
    }

    function updateCurrentComment(chatObj){
        let chatBlock = `<span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span>` 
        let chatArea = document.getElementById('frend-holder-current-comment')
        chatArea.innerHTML = chatBlock;
    }

    function appendIncomingChat(chatObj){
        let fragment = new DocumentFragment();
        let li = document.createElement("li");
        let chatBlock = `<span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span>`
        li.innerHTML= chatBlock;
        fragment.append(li);
        let chatArea = document.getElementById('frend-chat-messages-box')
        chatArea.append(fragment);
        chatArea.scrollTop = chatArea.scrollHeight;

    }

    // Add user's chat to chat window and queue the message to be processed.
    function queueNextMessage(data) {

        let incomingChat = {message:`My friend ${data.user_id} says:`+ data.message, question: data.message, username:data.user_id, scene:sceneController.getCurrentScene()}
        processor.enqueueMessage(incomingChat)
        

    }

    function getMessageProcessor(){
        return processor
    }

    return {
        getMessageProcessor,
        updateCurrentComment,
        updateCurrentDrawComment,
        appendIncomingChat,
        queueNextMessage,
        WebsocketChat
    }

})()
export default youtubeChatController