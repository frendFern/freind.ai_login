(function(){

    let frendIdInterval
    let currentCommentObj

    function updateCurrentDrawComment(chatObj){
        let span = document.createElement("span");
        let chatBlock = `<span class="frend-user">${chatObj.user_id}: </span><span class="frend-user-msg">${chatObj.message}</span>` 
        let chatArea = document.getElementById('frend-holder-current-comment-draw')
        chatArea.innerHTML = chatBlock;
    }

    function updateCurrentComment(chatObj){
        let span = document.createElement("span");
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

    function processNextMessage(data) {
        frendGlobalState.speaking = true
        try {
            appendIncomingChat(data)
            updateCurrentComment(data)
            currentCommentObj = data
            let incomingChat = `My friend ${data.user_id} says:`+data.message
            callOllama(incomingChat)
        } finally {
            frendGlobalState.speaking = false
        }

    }
    // Function to get current chat
    function getNextMessage(){
        fetch('http://192.168.0.101:8888/get_next_message') // message router
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
                //{message: 'ok this will work', user_id: 'frendai'}
                processNextMessage(data)
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    }
    frendIdInterval = setInterval(()=>{ getNextMessage() },10000) 

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
                console.log(inputString)
                console.log("No match found");
            }
        }
        if (extractedString){
            updateCurrentDrawComment(currentCommentObj)
        }
        // Return a JSON object with both the modified string and the extracted {string}
        return {
            cleanString : modifiedString,
            drawingRequest: extractedString
        };
    }


    function fetchAndDisplayImage(imageUrl, divId) {
        let url = frendGlobalState.frend_api_url + '/frend-draw/' + imageUrl // websocket_api
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.onload = function() {
                    // Image loaded successfully, update the div
                    const div = document.getElementById(divId);
                    div.innerHTML = imgElement.outerHTML;
                };
                imgElement.onerror = function() {
                    // Image failed to load, do not update the div
                    console.error('Failed to load image');
                };
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    function drawResponseToScreen(text){
        let responseBox = document.getElementById('frend-chat-response-holder')
        let span = document.createElement("span");
        span.innerHTML= text;
        responseBox.innerHTML=span.outerHTML;
    }

    // Function to call Ollama
    function callOllama(message){
        fetch(frendGlobalState.frend_api_url + '/frend-ollama-llm/chat',{ // ollama.py
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               message: message,
            })
        })
        .then(response => response.json())
        .then(data => {
            let llmResponse = processString(data.response);
            drawResponseToScreen(llmResponse.cleanString);
            callVoice(llmResponse.cleanString);

            // Assuming data contains information about a drawing
            if (llmResponse.drawingRequest) {
                // Call drawing API
                let drawingObj = callDrawing(llmResponse.drawingRequest)
            }
        })
        .catch(error => console.error('Error calling Ollama:', error));
    }

    // Function to call Drawing
    function callDrawing(prompt){
        fetch(frendGlobalState.frend_api_url + '/frend-draw/draw',{ // websocket_api example
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               prompt: prompt,
               style:'pixel art'
            })
        })
            .then(response => response.json())
            .then(data => {
                // Assuming data contains the drawing
                // You would handle the drawing data here
                // For example, display it in the UI
                console.log(data.image)
                fetchAndDisplayImage(data.image,'frend-chat-art-current');
            })
            .catch(error => console.error('Error fetching drawing:', error));
    }

    // Function to call Voice
    function callVoice(message){
        fetch(frendGlobalState.frend_api_url + '/frend-tts/tts',{ // host.py
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
            .then(data => {
                // Assuming data contains voice data
                // You would handle the voice data here
                // For example, play the voice message
                let speakURL = frendGlobalState.frend_api_url + '/frend-tts/' + data.file 
                frendStreamGlobalState.visableModel[0].speak(speakURL)
                console.log(data)
            })
            .catch(error => console.error('Error calling Voice API:', error));
    }

    // Function to animate (assuming this is for UI animations)
    function animate(){
        // Implement animation logic here
        // This could involve manipulating DOM elements or using a library like GSAP
    }

    // Musing
    function getMusing(){
        let content = frendGlobalState.frend_questions;
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
            processNextMessage(data)
        }
    }

    setInterval(()=>{getMusing()},300000)

})();
