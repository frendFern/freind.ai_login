let frend_audio
(async function(){

  const chatAiTemplate = document.getElementById('frend-chat-screen-hitsory-ai-template');
  const chatScreenHistory = document.getElementById('frend-chat-screen-history-msgs');
  const chatMessages = document.getElementById('frend-chat-messages');
  const chatInput = document.getElementById('frend-chat-screen-input-type');

  const muteButton = document.getElementById("frend-mute-btn");
  const isMuted = () => {
    return muteButton.innerHTML == "no_sound";
  }

  function getAudioFromAWS(message,buttonObj, chatControls, chatMessages, aiChat,chatScreenHistory){
      //Get voice from selection
      let currentVoice = localStorage.getItem('voice');

      const avatarToModel = JSON.parse(localStorage.getItem('avatarToModel') || "{}");
      const avatarName = localStorage.getItem("currentAvatar");
      frendGlobalState.currentModel = avatarToModel[avatarName] || "models/Rice/Rice.model3.json"

      let selectedVoice ="2"; //kid default
      if (frendGlobalState.currentModel === "models/Santa3/Santa.model3.json") {
        selectedVoice = "4"; 
      } else if (frendGlobalState.currentModel === "models/Natori/Natori.model3.json") {
        selectedVoice = "3" //deeep
      }

      console.log(`SELECTED VOICE IS: ${selectedVoice} FOR THE MODEL: ${frendGlobalState.currentModel}`);

      //TODO: add audio for chibi 

      let payload = {
              "text": message,
              "voice": selectedVoice
      }
      fetch(frendGlobalState.frend_api_url+'/frend-audio', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => {
              // Add the message to the chat display
              let audioObj = JSON.parse(data['body']);
              url = audioObj['audio']
              buttonObj.setAttribute('data-url',url)

              file_name = url.split('/').pop().split('.')[0]
              share_url = window.location.origin+'?v='+selectedVoice+'&a='+file_name
              chatControls.setAttribute('data-share-url',share_url)

              chatMessages.appendChild(chatControls)
              chatMessages.scrollTop = chatMessages.scrollHeight

              aiChat.appendChild(chatControls)
              chatScreenHistory.scrollTop = chatScreenHistory.scrollHeight

              // Speak only if not muted.
              if (!isMuted()){
                frendGlobalState.visableModel[0].speak(url)
              }
          })
          .catch(error => console.error('Error:', error))
          .finally(() => {
            frendGlobalState.animate.resetEmotion(frendGlobalState.visableModel[0])
            frendGlobalState.speaking = false
          });
  }

  function getModelName(model) {
    const modelMap = {
        "models/shiba/shiba.model3.json": "Shiba",
        "models/katie/YelloJacketGirl.model3.json": "Katie",
        "models/2b/2b.model3.json": "2B",
        "models/chibi_costimzable2.0_marinki/costomizble_chibi2.0.model3.json": "Chibi",
        "models/kat/free1.model3.json": "Kat",
        "models/Santa3/Santa.model3.json": "Santa",
        "models/haru/haru_greeter_t03.model3.json" : "Susan",
        "models/Hiyori/Hiyori.model3.json" : "Hiyori",
        "models/Mao/Mao.model3.json" : "Mao",
        "models/Mark/Mark.model3.json" : "Marcus",
        "models/Natori/Natori.model3.json" : "Natori",
        "models/Rice/Rice.model3.json" : "Rice",
        "models/RAM/RAM/RAM.model3.json": "Ram",
        "models/REM/REM.model3.json": "Rem",
        "models/Neyra_V1/Neyra_Ver1.model3.json": "Neyra"


    };

    // Get the avatar name from local storage. If none, use modelMap. If none, use Bobby
    let avatarName = localStorage.getItem("currentAvatar") || modelMap[model] || "Bobby"; 
    avatarName = avatarName == null ? modelMap[model] || "Bobby" : avatarName;
    return avatarName
}

  // let frendSpeak = function(reply){
    function frendSpeak(reply){
      // Add the message to the chat display
      const messageElement = document.createElement('p');
      
      // Chat controls
      let chatControls = document.createElement("div");
      let replayButton = document.createElement("button");
      let stopButton = document.createElement("button");
      let shareButton = document.createElement("button");
      
      chatControls.classList.add('frend-control-center');
      replayButton.classList.add('pure-button','smaller-button')
      stopButton.classList.add('pure-button','smaller-button')
      shareButton.classList.add('pure-button','smaller-button')


      //New chat area
      let aiChat = chatAiTemplate.firstElementChild.cloneNode(true)
      aiChat.firstElementChild.innerText = getModelName(frendGlobalState.currentModel);
      aiChat.lastElementChild.innerText=reply
      chatScreenHistory.appendChild(aiChat);
      chatScreenHistory.scrollTop = chatScreenHistory.scrollHeight

      getAudioFromAWS(reply, replayButton, chatControls, chatMessages, aiChat, chatScreenHistory)    
      
      let aiMessage = reply
      messageElement.textContent = aiMessage;
      frendGlobalState.chat.push(aiMessage)
      chatMessages.appendChild(messageElement);
  

      //Draw replayButton
      replayButton.innerHTML='<i class="icono-sync"></i>'
      const playRecord = function () {
          let url = this.getAttribute('data-url')
          if (!isMuted()){
            frendGlobalState.visableModel[0].speak(url) 
          }
      }
      replayButton.onclick = playRecord

      //Draw stopButton
      stopButton.innerHTML='<i class="icono-stop"></i>'
      const stopMessage = function () {
        frendGlobalState.visableModel[0].stopSpeaking() 
      }
      stopButton.onclick = stopMessage


      //Draw shareButton
      shareButton.innerHTML='<i class="icono-share"></i>'
      var shareMessage = async function () {
          // The text to be copied
          let url = this.parentElement.getAttribute('data-share-url')
          const textToCopy = url;

          try {
          // Copy the text to the clipboard
          await navigator.clipboard.writeText(textToCopy);

          // Show the toast message
          const toast = document.getElementById('frend-toast');
          toast.textContent = 'Copied to clipboard';
          toast.classList.add('show');

          // Hide the toast message after 3 seconds
          setTimeout(() => {
              toast.classList.remove('show');
          }, 3000);
          } catch (err) {
          console.error('Failed to copy text: ', err);
          } 
      }
      shareButton.onclick = shareMessage
  
  
      chatControls.appendChild(replayButton);
      chatControls.appendChild(stopButton);
      chatControls.appendChild(shareButton);
  
  
      chatMessages.scrollTop = chatMessages.scrollHeight

  }
  frendGlobalState.audio.frendSpeak = frendSpeak;


  function audioBufferToWav (buffer, opt) {
      opt = opt || {}
    
      var numChannels = buffer.numberOfChannels
      var sampleRate = buffer.sampleRate
      var format = opt.float32 ? 3 : 1
      var bitDepth = format === 3 ? 32 : 16
    
      var result
      if (numChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1))
      } else {
        result = buffer.getChannelData(0)
      }
    
      return encodeWAV(result, format, sampleRate, numChannels, bitDepth)
  }

  function encodeWAV (samples, format, sampleRate, numChannels, bitDepth) {
  var bytesPerSample = bitDepth / 8
  var blockAlign = numChannels * bytesPerSample

  var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  var view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, 'RIFF')
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  /* RIFF type */
  writeString(view, 8, 'WAVE')
  /* format chunk identifier */
  writeString(view, 12, 'fmt ')
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, 'data')
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true)
  if (format === 1) { // Raw PCM
      floatTo16BitPCM(view, 44, samples)
  } else {
      writeFloat32(view, 44, samples)
  }

  return buffer
  }

  function interleave (inputL, inputR) {
  var length = inputL.length + inputR.length
  var result = new Float32Array(length)

  var index = 0
  var inputIndex = 0

  while (index < length) {
      result[index++] = inputL[inputIndex]
      result[index++] = inputR[inputIndex]
      inputIndex++
  }
  return result
  }

  function writeFloat32 (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 4) {
      output.setFloat32(offset, input[i], true)
  }
  }

  function floatTo16BitPCM (output, offset, input) {
  for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
  }

  function writeString (view, offset, string) {
  for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
  }
  }

  // create a audioContext that helps us decode the webm audio
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Initialize variables
  let mediaRecorder;
  let audioStream;
  let isRecording = false;

  // Function to start recording when the space bar is pressed
  function startRecording() {
    //Reset the audio chunks each time
    let audioChunks = [];
    if (!isRecording) {
      frendGlobalState.chat.chatState(0)
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          audioStream = stream;
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };
          mediaRecorder.onstop = () => {
            var blob = new Blob(audioChunks, { 'type': 'audio/webm; codecs=opus' });
              var arrayBuffer;
              var fileReader = new FileReader();
              fileReader.onload = function(event) {
                  arrayBuffer = event.target.result;
              };
              fileReader.readAsArrayBuffer(blob);
              fileReader.onloadend=function(d){
                  audioCtx.decodeAudioData(
                      fileReader.result,
                      function(buffer) {
                          var wav = audioBufferToWav(buffer);
                          setTimeout(() => sendAudioToAPI(wav), 1000);
                      },
                      function(e){ console.log( e); }
                  );
              };
          };
          mediaRecorder.start();
          isRecording = true;
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    }
  }
  // Function to stop recording when the space bar is released
  function stopRecording() {
    if (isRecording) {
      mediaRecorder.stop();
      audioStream.getTracks().forEach((track) => track.stop());
      isRecording = false;
    }
  }

  function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  function submit_func(response){
      message = response.body.DisplayText
      chatInput.value = message
      frendGlobalState.chat.sendChatToServer()
    }

  // Function to send audio data to your API
  function sendAudioToAPI(audioBlob) {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const apiEndpoint = frendGlobalState.frend_api_url+'/frend-stt';
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "audio/wav",
      },
      body: audioBlob
    })
      .then((response) => response.json().then((j) => 
        {
          submit_func(j, true)
        }))
      .catch((error) => {
        console.error('Error sending audio to API:', error);
      });
  }
  var image = document.getElementById('image');
  var normalImageSrc = 'static/mic.png';
  var redImageSrc = 'static/pause.png';

  var spaceBarPressed = false;
  var spaceBarPressStartTime = 0
  var spaceBarTimeout = null;
  document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && !spaceBarPressed &&
    document.activeElement.id !== 'frend-chat-screen-input-type') {
      spaceBarPressed = true;
      spaceBarPressStartTime = Date.now();
      spaceBarTimeout = setTimeout(function () {
        frendGlobalState.chat.chatState(2)
        startRecording();
      }, 500); // 0.5 seconds (500 milliseconds)
    }
  });

  document.addEventListener('keyup', function (event) {
    if (event.key === ' ' &&
    document.activeElement.id !== 'frend-chat-screen-input-type') {
      clearTimeout(spaceBarTimeout);
      spaceBarPressed = false;
      frendGlobalState.chat.chatState(3)
      stopRecording();
    }
  });


  //Push to talk button
  const pptBtn = document.getElementById('frend-ppt-btn');
  if (window.mobileCheck){
    let startMic=false;
    pptBtn.onclick = function(){
      if(!startMic){
        frendGlobalState.chat.chatState(2)
        startRecording();
        startMic = true;
      }else{
        frendGlobalState.chat.chatState(3)
        stopRecording();
        startMic = false;
      }
    };
    

  }else{
    pptBtn.addEventListener('mousedown',function(){
        frendGlobalState.chat.chatState(2)
        startRecording();
    });
    pptBtn.addEventListener('mouseup',function(){
      frendGlobalState.chat.chatState(3)
      stopRecording();
    });

  }

})()