let frend_chat
(async function(){
  const chatInput = document.getElementById('frend-chat-screen-input-type');
  const chatUserTemplate = document.getElementById('frend-chat-screen-hitsory-user-template');
  let chatHistory=[]
  const chatMessages = document.getElementById('frend-chat-messages');
  const chatScreenHistory = document.getElementById('frend-chat-screen-history-msgs');
  const chatForm = document.getElementById('frend-chat-form');
  const inputBoxButton = document.getElementById("frend-chat-screen-input-button")
  const floaterDiv = document.getElementById('frend-floater');
  const pptBtn = document.getElementById('frend-ppt-btn');
  const mainBody = document.getElementById('main-body');
  const aiIsTypingControl = document.getElementById("frend-input-loading");
  const isTypingAnimationText = document.getElementById("typingAnimationText");


  // Pull messages from Youtube live stream for admin user
  const cookie = JSON.parse(localStorage.getItem("cookie")) || null;
  const id = cookie?.session?.user?.id;
  let isFetchingLiveStreamMessages = false;
  const getLiveStreamMessages = async() => {
    return await fetch(frendGlobalState.frend_api_url+'/get-youtube-live-stream-messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: "no-cache"
    }).then(response => response.json());
  }

  // Check if id is equal to the youtube admin account.
  /*if (id === "3bdb54a5-10fc-4c3a-9e0a-cc272948a41b") {
    console.log("User matched!")
    setInterval(async () => {
      if (isFetchingLiveStreamMessages){
        return;
      }

      isFetchingLiveStreamMessages = true;
      console.log("Fetching live stream messages...")
      try {
        const { messages:liveStreamMessages } = await getLiveStreamMessages();
        console.log("liveStreamMessages: " + liveStreamMessages)
        for (let message of liveStreamMessages){
          chatInput.value = message;
          await sendChatToServer();
        }
      } catch(err) {
        console.log("An error has occured while getting live stream messages: " + err)
      }
      isFetchingLiveStreamMessages = false
    },1000)
  }*/
  // Modal logic
  const maxMessageLimitModal = document.getElementById("max-message-limit-modal")
  const purchaseMembershipButton =  document.getElementById("modal-purchase-button")
  const maxMessageModalCancel =  document.getElementById("modal-purchase-cancel-button")
  const maxMessageModalClose =  document.getElementById("max-message-modal-close-button")
  maxMessageModalCancel.onclick = function() {
    maxMessageLimitModal.classList.add('hidden');
  }
  maxMessageModalClose.onclick = function() {
    maxMessageLimitModal.classList.add('hidden');
  }
  purchaseMembershipButton.onclick = function() {
    maxMessageLimitModal.classList.add('hidden');
  }

  const promptLoginModal = document.getElementById("prompt-login-modal")
  const promptLoginModalLoginButton =  document.getElementById("modal-login-button")
  const promptLoginModalCancelButton =  document.getElementById("modal-cancel-button")
  const promptLoginModalClose =  document.getElementById("prompt-login-modal-close-button")
  promptLoginModalCancelButton.onclick = function() {
    promptLoginModal.classList.add('hidden');
  }
  promptLoginModalClose.onclick = function() {
    promptLoginModal.classList.add('hidden');
  }
  promptLoginModalLoginButton.onclick = function() {
    promptLoginModal.classList.add('hidden');
  }

  // Explore tab logic
  document.querySelectorAll(".explore-text").forEach(async function (element) {
    await element.addEventListener("click", async function () {
      if (!chatForm.classList.contains("hidden")){
        const text = element.querySelector("p").innerHTML.trim()
        chatInput.value = chatInput.value + text;
      }
  });
});


  // Pre-canned prompts
  const promptButtonsContainer = document.getElementById('pre-canned-prompts-container');

  const prompts = [
      "Let me vent",
      "Learn something",
      "Generate ideas",
      "Safe space",
      "Advice",
      "Practice",
      "Homework",
      "Philosophical",
      "Coach me",
      "Discover",
      "Motivate me",
      "Calm me down",
      "Future plan",
      "Think of a gift",
      "Help me decide",
      "Career plan",
      "Help me write",
      "I'm feeling overwhelmed"
  ];

  function handlePromptButtonClick(promptText) {
    chatInput.value = promptText;
    sendChatToServer();
  }

  // Function to get random prompts
  function getRandomPrompts() {
    const randomPrompts = [];
    while (randomPrompts.length < 3) {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      const randomPrompt = prompts[randomIndex];
      if (!randomPrompts.includes(randomPrompt)) {
        randomPrompts.push(randomPrompt);
      }
    }
    return randomPrompts;
  }

  getRandomPrompts().forEach(prompt => {
      const button = document.createElement("button");
      button.textContent = prompt;
      button.classList.add("prompt-button"); 
      button.addEventListener("click", () => {
          handlePromptButtonClick(prompt);
      });
      const lineBreak = document.createElement("br"); 
      promptButtonsContainer.appendChild(button);
      promptButtonsContainer.appendChild(lineBreak);
  });

  const showMoreButton = document.createElement("button");
  showMoreButton.textContent = "Show More";
  showMoreButton.classList.add("prompt-button"); 

  showMoreButton.addEventListener('click', () => {
      document.getElementById('frend-explore-menu').classList.remove('hidden');
  });

  promptButtonsContainer.appendChild(showMoreButton);


  // Mute button logic
  const muteButton = document.getElementById("frend-mute-btn");
  if (localStorage.getItem("sound") !== null){
    muteButton.innerHTML = localStorage.getItem("sound");
  }

  muteButton.onclick = () => {
    if (muteButton.innerHTML == "no_sound"){
      muteButton.innerHTML = "volume_up"
      localStorage.setItem("sound", "volume_up")
    }else {
      muteButton.innerHTML = "no_sound"
      frendGlobalState.visableModel[0].stopSpeaking();
      localStorage.setItem("sound", "no_sound")
    }
  }
  
  // Ad modal logic
  const watchAdButton = document.getElementById('watch-ad-button');
  const adModalDone = document.getElementById('ad-done-button');
  const adModal = document.getElementById('ad-modal')
  watchAdButton.onclick = () => {
    maxMessageLimitModal.classList.add('hidden');
    adModal.classList.remove('hidden');
  }

  adModalDone.onclick = async () => {
    adModalDone.disabled = true;
    const userid = JSON.parse(localStorage.getItem('cookie'))?.session?.user?.id
    if (userid) {
      // call lambda function to increase msg
      await fetch(frendGlobalState.frend_api_url+'/increment-available-messages-from-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userid
        })
      });
    }
    adModal.classList.add('hidden');
  }

  frendGlobalState.chat = chatHistory

  // Retrieving token from localStorage
  function getTokenFromLocalStorage() {
    return localStorage.getItem('token');
  }

  const speak = (text) => {
    frendGlobalState.visableModel[0].stopSpeaking();
    frendGlobalState.audio.frendSpeak(text)
    frendGlobalState.speaking = true
  }

  let lastRendered;
  let sendChatToServer = async function(event) {
      let userid = JSON.parse(localStorage.getItem('cookie'))?.session?.user?.id
      if(!userid) {
        promptLoginModal.classList.remove('hidden');
        console.error("User must login.")
        return;
      }
    
      chatState(0)
      frendGlobalState.animate.setEmotion(frendGlobalState.visableModel[0])
      let message
      try{
        message = event.target.elements.message.value;
      }catch{
        message =chatInput.value;
      }

      // Clear the message input
      try{
        event.target.elements.message.value = '';
      }catch{
        chatInput.value='';
      } 

      if (message.length == 0){
        speak('Seems we have an issue with the mic, try getting closer or speaking louder.')
        chatState(1)
        return
      }
    
      const myMessageElement = document.createElement('p');
      userMessage = "User: "+message
      myMessageElement.textContent = userMessage;
      chatHistory.push(userMessage)
      chatMessages.appendChild(myMessageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight
    
    
      //New chat area
      let userChat = chatUserTemplate.firstElementChild.cloneNode(true)
      userChat.firstElementChild.innerText="User"
      userChat.lastElementChild.innerText=message
      chatScreenHistory.appendChild(userChat);
      chatScreenHistory.scrollTop = chatScreenHistory.scrollHeight
    
    
      promptContext = message


      const modelToFrendCardMap = {
        "models/Santa3/Santa.model3.json": "santa.json",
        "models/kat/free1.model3.json": "kat.json",
        "models/2b/2b.model3.json": "2b.json",
        "models/katie/YelloJacketGirl.model3.json": "Katie.json",
        "models/shiba/shiba.model3.json": "shiba.json",
        "models/chibi_costimzable2.0_marinki/costomizble_chibi2.0.model3.json": "Chibi.json",
        "models/haru/haru_greeter_t03.model3.json": "susan.json",
        "models/Hiyori/Hiyori.model3.json": "hiyori.json",
        "models/Mao/Mao.model3.json": "mao.json",
        "models/Rice/Rice.model3.json": "rona.json",
        "models/Mark/Mark.model3.json": "marcus.json",
        "models/Natori/Natori.model3.json": "natori.json",
        "models/RAM/RAM/RAM.model3.json": "ram.json",
        "models/REM/REM.model3.json": "rem.json",
        "models/BeatricePoolParty/Beatrice-Pool-Party/Beatrice-Pool-Party.model3.json": "beatrice.json",
        "models/Anastasia_Party/Anastasia_Party.model3.json": "anastasia.json",
        "models/Russell-Fellow/Russell-Fellow.model3.json": "russell.json",
        "models/Julius/Julius.model3.json": "julius.json",
        "models/Kadomon_Risch/Kadomon_Risch.model3.json": "Kadomon.json"
     
        
      };      

      let frendCard = modelToFrendCardMap[frendGlobalState.currentModel];
        

      lastRendered = localStorage.getItem("lastRendered");
      // Send the message to the Cohere API
      const data = await fetch(frendGlobalState.frend_api_url+'/frend-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: promptContext,
          chatHistory:chatHistory.join('\n'),
          userid: userid,
          // frendCard: "santa.json"
          frendCard: frendCard,
          isCohere: false
        })
      })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
      if (localStorage.getItem("lastRendered") != lastRendered){
        // Rendered new model. Do not continue with this chat.
        aiIsTypingControl.classList.add("hidden")
        return;
      }

      try {
        if (data.max_message_error) {
          maxMessageLimitModal.classList.remove('hidden');
          chatState(1)
          return;
        }
        let retry = false;
        if (data.text){
          data.text = data.text.replaceAll("Shiba:", "");
        }else{
          data.text = "Seems like I am experiencing some issues. Please hold on..." 
          retry = true;
        }

        speak(data.text)
        if (retry){
          const retryData = await fetch(frendGlobalState.frend_api_url+'/frend-llm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              message: promptContext,
              chatHistory:chatHistory.join('\n'),
              userid: userid,
              // frendCard: "santa.json"
              frendCard: frendCard,
              isCohere: true
            })
          })
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
          if (retryData.text){
            retryData.text = retryData.text.replaceAll("Shiba:", "");
          }else{
            retryData.text = "Seems like my language model is having some issues.  Sorry about this, please try talking to me again in a few hours.  Or reach out to hi@frend.ai and let us know something is wrong."
          }
          speak(retryData.text)
        }
                
      } catch(error) {
        console.error('Error:', error)
      }
      chatState(1)
  }
  frendGlobalState.chat.sendChatToServer = sendChatToServer
  
  //Chat controls
  // const chatSendBtn = document.getElementById('frend-chat-screen-input-submit');
  // chatSendBtn.onclick = sendChatToServer;
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChatToServer()
  })
  chatInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
          sendChatToServer();
        }
    });

  function chatState(state){
    
    if (state == 0){
      //Show 'is typing' and disable input box
      chatInput.disabled = true;
      inputBoxButton.disabled = true;
      isTypingAnimationText.innerHTML = (localStorage.getItem('currentAvatar') !== null ? localStorage.getItem('currentAvatar') :'AI Frend')  + " is typing..."
      aiIsTypingControl.classList.remove("hidden")

      // Disable prompts
      const prompts = document.querySelectorAll(".prompt-button");
      for (let prompt of prompts){
        prompt.disabled = true
        prompt.classList.add("bg-neutral-700", "rounded-md", "cursor-not-allowed")
      }
    }
    else if(state == 1){
      //Hide 'is typing' and re-enable input box
      chatInput.disabled = false;
      inputBoxButton.disabled = false;
      aiIsTypingControl.classList.add("hidden")

      // Enable back prompts
      const prompts = document.querySelectorAll(".prompt-button");
      for (let prompt of prompts){
        prompt.disabled = false
        prompt.classList.remove("bg-neutral-700", "rounded-md", "cursor-not-allowed")
      }
    }
    else if(state == 2){
      //Show push to talk icon
      floaterDiv.classList.add('show');
      // widgethControls.classList.add('show');
      pptBtn.classList.add('frend-press');
    }
    else if(state == 3){
      //Show push to talk icon
      floaterDiv.classList.remove('show');
      // widgethControls.classList.remove('show');
      pptBtn.classList.remove('frend-press');
    }
    else if(state == 4){
      //Close all sign in / sign up
      //Change sign in / signup to / details
      loginScreen.classList.add('hidden')
      signInUpLink.classList.add('hidden')
      accountDetails.classList.remove('hidden')
    }
  }
  frendGlobalState.chat.chatState = chatState;

  // AI Sends initial message.
  mainBody.onmouseover = function() {
      const initialMessage = {
        "shiba": "*excited bark* Hello! How are you today?",
        "katie": "*looks up from her sketchbook* Oh hey! how are you today?",
        "2b": "*2B tilts her head slightly, her eyes narrowing in curiosity.* Hello! What brings you here?",
        "chibi": "Oh, hello there! *twinkle* How are you today?",
        "kat": "*smiling* Hello there! How are you today?",
        "santa": "Ho ho ho! *winks* How are you today?",
        "susan": "*smiling* It's great to see you! How are you today?",
        "hiyori": "*excitedly* Oh, cool!  How are you today?",
        "mao": "*eyes widen* Ah, a new friend! How are you today?",
        "marcus": "*chuckles* Oh, man... How are you today?",
        "natori": "(smiling) Ah, a new acquaintance How are you today?",
        "rice": "*smiling* Ah, a curious seeker! How are you today?",
        "rona": "*smiling* Ah, a curious seeker! How are you today?", // same AI as rice
        "ram": "Hello master! how can I serve you today?",
    }

    if (localStorage.getItem('isFirstMessage') === 'true'){
      const avatarName = localStorage.getItem('currentAvatar').toLowerCase()
      const initMessage = initialMessage[avatarName] || "Hello! How are you today?"
      speak(initMessage);
      localStorage.setItem('isFirstMessage','false');
    }
  }

})()




