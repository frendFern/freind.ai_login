    
    const socketAddress = 'wss://youtube-websocket.danny-5e7.workers.dev/s/';

   async function handleCredentialResponse(response){
      console.log(response);
      const searchParams = new URLSearchParams(window.location.search);
      let chatId = searchParams.get('chatid')
      let apiKey = searchParams.get('apiKey')

      try {

        new Promise((resolve,reject) => {
          getLiveChatId(resolve, chatId, apiKey)
        }).then(result => {
          sendChat(result, apiKey, response.credential);
        }).catch(error => {
          console.log("error occured: ", error);
        })

      } catch (error) {
        console.error('Error in main function:', error);
      }
      
    }

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
            let apiKey = searchParams.get('apiKey')

            let currentStream  = socketAddress+chatid
            let socket = new WebSocket(currentStream);

            embedYoutubeChat(chatid)
            const ping_interval = 120000; //keep link alive
            // Connection opened
            const sendMessage = JSON.stringify({ping:1});
            let interval
            socket.addEventListener('open', function (event) {
                console.log('WebSocket is open now.');
                // Send a message to the server
                socket.send(sendMessage);
                console.log('Keeping things alive')
                console.log(chatid);
                                
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


  async function getLiveChatId(resolve, videoid, apiKey) {

    if(!apiKey) return;

      fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoid}&part=snippet,contentDetails,statistics,liveStreamingDetails&key=${apiKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = response.json();      

        return data; // Parses the response as JSON
      })
      .then(data => {
        resolve(data.items[0].liveStreamingDetails.activeLiveChatId)
        return;
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });

  }


  async function sendChat(liveChatId, apiKey, auth_token) {
    fetch(`https://youtube.googleapis.com/youtube/v3/liveChat/messages?part=snippet&key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          liveChatId: `${liveChatId}`,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: 'cool!'
          }
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    
  }

  