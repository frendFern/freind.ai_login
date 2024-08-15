(function(){
    var parentUrl = window.parent.location.href;

    // Create a URLSearchParams object with the current URL's query string
    const urlParams = new URLSearchParams(window.location.search);
    var url = new URL(parentUrl);

    // Use URLSearchParams to get the 'stream' query parameter
    var streamValue = url.searchParams.get('stream');
    // Check if the 'stream' parameter is 'true'
    if (streamValue === 'true') {
        const chatInput = document.getElementById('frend-chat-screen-input-type');
        // Proceed with the rest of your code
        console.log("Stream parameter is true");
        // Your code here
        function getNextMessage(){
            fetch('http://localhost:8888/get_next_message')
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
                    chatInput.value = `My friend ${data.user_id} says:`+data.message
                    frendGlobalState.chat.sendChatToServer()
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
        }
        setInterval(()=>{ getNextMessage() },20000)

        function getMusing(){
            content = [
                "Talk about your friends",
                "Talk about the weather",
                "Have a random thought",
                "Get philisophical",
            ]
            function getRandomElement(array) {
                const randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            if(frendGlobalState.speaking) {
                // Don't muse
                return
            }else{
                chatInput.value = getRandomElement(content)
                frendGlobalState.speaking=true
                frendGlobalState.chat.sendChatToServer()
            }
        }

        setInterval(()=>{getMusing()},200000)


    } else {
        console.log("Stream parameter is not true or not present");
        // Your code here
    }
})()