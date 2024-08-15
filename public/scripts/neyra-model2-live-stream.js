(function(){
    let messageQueue = [];

    function getAudioDuration(src) {
        return new Promise(function(resolve) {
            let audio = new Audio();
            audio.addEventListener("canplaythrough", function(){
                resolve(audio.duration);
            });
            audio.src = src;
        });
    }

    function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    // Add user's chat to chat window and queue the message to be processed.
    function queueNextMessage(data) {
        appendIncomingChat(data)

        // Show Processing Text only if neyra is not typing.
        if (!isProcessing){
            processingText()
        }

        frendStreamGlobalState.setEmotion(frendStreamGlobalState.visableModel[0],'eyesClose');
        setTimeout(function(){
            frendStreamGlobalState.setEmotion(frendStreamGlobalState.visableModel[0],'eyesShine');
        },1000)
        let incomingChat = `My friend ${data.user_id} says:`+data.message
        messageQueue.push(incomingChat)
    }

    frendStreamGlobalState.queueNextMessage= queueNextMessage

    async function processNextMessage() {
        try {
            const msg = messageQueue.shift();
            await callNeyraLLMApi(msg)
        } catch (error) {
            console.error("Failed to process next message from the message queue. " + error)
        }
    }

    async function speak(speakURL){
        frendGlobalState.speaking=true

        frendStreamGlobalState.setEmotion(frendStreamGlobalState.visableModel[0],'eyesOpen');
        setTimeout(async function(){
            try {
                frendStreamGlobalState.visableModel[0].speak(speakURL)
                await sleep(await getAudioDuration(speakURL))
            } finally {
                frendGlobalState.speaking=false
            }
        }, 1000)
            
    }

    // function appendIncomingChat(chatObj){
    //     let fragment = new DocumentFragment();
    //     let li = document.createElement("li");
    //     chatBlock = `<span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span>`
    //     li.innerHTML= chatBlock;
    //     fragment.append(li);
    //     let chatArea = document.getElementById('frend-chat-messages-box')
    //     chatArea.append(fragment);
    //     chatArea.scrollTop = chatArea.scrollHeight;
    // }

    function appendIncomingChat(chatObj) {
        let chatArea = document.getElementById('frend-chat-messages-box');
        // let chatArea = document.getElementById('frend-chat-messages-holder'); 

        let chatBlock = `<li><span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span></li>`;
        chatArea.innerHTML = chatBlock;  
        chatArea.scrollTop = chatArea.scrollHeight;  
    }

    // Function to get current chat
    function getNextMessage(){
        fetch('http://localhost:8888/get_next_message') // message router
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            try {
                if (response.status === 200){
                    return response.json();
                }else{
                    return {"type":"ignore"}
                }

            } catch (error) {
                // If parsing fails, the value is not JSON
                return response.statusText;
            }
        })
        .then(data => {
            console.log(data); // Process the data here
            if (data.type === "ignore"){
                return
            }else{
                queueNextMessage(data)
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    }
    
    //Checking messages every 2 seconds.
    //let frendIdIntervalID = setInterval(()=>{ getNextMessage() },2000) 

    //SOCKET based youtube:
    function WebsocketChat(){
        function getTimestampInSeconds () {
            return Math.floor(Date.now() / 1000)
          }
        let currentTime = getTimestampInSeconds()
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('chatid')){
            let chatid = searchParams.get('chatid')
            let currentStream  = 'wss://youtube-websocket.danny-5e7.workers.dev/s/'+chatid
            let socket = new WebSocket(currentStream);

            const ping_interval = 120000; //keep link alive
            // Connection opened
            const sendMessage = JSON.stringify({ping:1});
            let interval
            socket.addEventListener('open', function (event) {
                console.log('WebSocket is open now.');
                // Send a message to the server
                socket.send(sendMessage);
                console.log('Keeping things alive')
                interval = setInterval(()=>{
                    console.log(sendMessage)
                    socket.send(sendMessage);
                }, ping_interval)
            });
            // Listen for messages
            socket.addEventListener('message', function (event) {
                console.log('Message from server: ', event.data);
                let eventDataJson = JSON.parse(event.data)
                console.log(currentTime, eventDataJson.unix)
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
                clearInterval(interval);
                setTimeout(function(){WebsocketChat()},1000)
            });
        }
    }
    WebsocketChat()


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
                console.log(prompt); // Output: "This is a test"]
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

    function drawResponseToScreen(llmText){
        setTimeout(function(){
            let span = document.getElementById('frend-typing')
            span.innerHTML = "";
            const typingSpeed = 60; // Speed in milliseconds
            
            let index = 0;
            function typeText(span,text) {
                if (index < text.length) { // Keep typing if the text is not finished being fully displayed
                    span.innerHTML += text.charAt(index);
                    index++;
                    setTimeout(function(){typeText(span,text)}, typingSpeed);
                }else { // Set isProcessing flag to false when the text is fully shown/done typing.
                    isProcessing = false
                }
            }

            // Start the typing effect
            typeText(span,llmText);
        },3000);
    }

    async function callNeyraLLMApi(message) {
        await fetch('https://d2141ekkpgdi0u.cloudfront.net/neyra-llm',{ 
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
            if (!data.response){
                throw new Error("An error calling neyra LLM. There was no data.response.")
            }
            let llmResponse = processString(data.response);
            drawResponseToScreen(llmResponse.cleanString);
            await callNeyraVoice(llmResponse.cleanString);
        })
        .catch(async error => {
            console.error("Neyra LLM failed to execute. Error: " + error + ". Calling Ollama LLM..." )
            await callOllama(message)
        })
    }
    
    // Function to call Ollama
    async function callOllama(message){
        await fetch(frendGlobalState.frend_api_url + '/frend-ollama-llm/chat?user=Neyra',{ // ollama.py
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               message: message
            })
        })
        .then(response => response.json())
        .then(async data => {
            if (!data.response){
                throw new Error("Error calling Ollama LLM. No data.response");
            }
            let llmResponse = processString(data.response);
            drawResponseToScreen(llmResponse.cleanString);
            await callNeyraVoice(llmResponse.cleanString);
        })
        .catch(async error => {
            console.error('Error calling Ollama:' + error + " Calling cloudflare.")
            await callCloudflare(message)
        });
    }

    async function callCloudflare(message) {
        const url = 'https://d2141ekkpgdi0u.cloudfront.net/frend-llm';
        let payload = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              message: message,
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
                  message: message,
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
                drawResponseToScreen(llmResponse.cleanString);
                await callNeyraVoice(llmResponse.cleanString);
            }).catch(error => console.error('Error calling OctoAI LLM:' + error));

        }else {
            // Process LLm response from cloudflare.
            let llmResponse = processString(data.text);
            drawResponseToScreen(llmResponse.cleanString);
            await callNeyraVoice(llmResponse.cleanString);
        }
    }



    async function callNeyraVoice(message) {
        await fetch('https://d2141ekkpgdi0u.cloudfront.net/neyra-tts',{ 
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
            await callVoice(message);
        });
    }
    
    // Function to call Voice
    async function callVoice(message){
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
            // Assuming data contains voice data
            // You would handle the voice data here
            // For example, play the voice message
            speakURL = frendGlobalState.frend_api_url + '/frend-tts/' +data.file 
            await speak(speakURL)
        })
        .catch(error => console.error('Error calling Voice API:', error));
    }
    // Musing
    function getMusing(){
        let content = frendGlobalState.neyraQuestions;
        function getRandomElement(array) {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        }
        if(frendGlobalState.speaking) {
            // Don't muse
            return
        }else{
            const data = {
                user_id: "User",
                message: getRandomElement(content)
            }
            queueNextMessage(data)
        }
    }

    let isProcessing = false;
    setInterval(async () => {
        if(messageQueue.length > 0 && !isProcessing){
            isProcessing = true
            await processNextMessage();
        }
    }, 1000)

    //Disabled musing as per client request April 6th
    //setInterval(()=>{getMusing()},300000)

})();
