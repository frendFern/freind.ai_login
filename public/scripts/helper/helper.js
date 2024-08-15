export const helperFunctions = (function(){
    
    function sleep(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }


   async function getAudioDuration(src) {
        let audioPromise = await new Promise(function(resolve) {
            let audio = new Audio();
            audio.addEventListener("canplaythrough", function(){
                resolve(audio.duration);
            });
            audio.src = src;
        });

        return audioPromise;
    }

    function removeElementAfterDelay(element, delayInSeconds) {
        const delayInMilliSeconds = delayInSeconds * 1000

        setTimeout(() => {
            element.remove()
        }, delayInMilliSeconds);
    }

    let intervalId;
    async function startCountdown(totalSeconds, timerSpan) {

        return new Promise((resolve, reject) => {
            clearInterval(intervalId); // Clear any existing interval at the start
            intervalId = null; // Reset the intervalId to null
            
            frendGlobalState.totalTimerSeconds = totalSeconds

            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
        
            // Format minutes and seconds to ensure they are two digits
            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');
        
            // Update the display
            totalSeconds--
            timerSpan.textContent = `${minutes}:${seconds}`;


            if (totalSeconds >= 0) { // Check if i is greater than or equal to 0
              intervalId = setTimeout(() => {
                startCountdown(totalSeconds, timerSpan).then(resolve); // Recursively call countDown with the decremented value
              }, 1000); // Wait for 1 second before the next decrement
            } else {
            timerSpan.textContent = `00:00`;
              resolve('Counter finished'); // Resolve the promise when countdown reaches zero
              clearTimeout(intervalId)
            }
          });

    
    }


    function secondsToMillisecondsConverter(seconds){
        return parseInt(seconds) * 1000
    }


    function autoScrollParent(e) {
        const parentHeight = e.target.offsetHeight;
        const childHeight = document.getElementById('frend-typing').offsetHeight;
        parent.scrollTop = childHeight - parentHeight;
        
    }


    function filterAndLimit(queue, condition, limit){
        const filtered = queue.filter(item => condition(item))

        return filtered.slice(0, limit)
    }

    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return [str.slice(0, maxLength - 3), '...'].join('');
        }
        return str;
    }
 
    function isScrolledToBottom(element) {
        const elementHeight = element.scrollHeight;
        const viewportHeight = element.clientHeight;
        const scrollPosition = element.scrollTop;
        const isReachedBottom = elementHeight - viewportHeight <= scrollPosition;
        return isReachedBottom;
      }

    
      async function downloadAudio(url, filename, audioDuration) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          localStorage.setItem(`${filename}-audioDuration`,audioDuration)
          localStorage.setItem(`${filename}-audioFile`, filename)

          saveBlob(blob, filename)
          
        } catch (error) {
          console.error('Error converting URL to Blob:', error);
          throw error;
        }
      }

    function saveBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'audio.wav'; // Default filename if none provided
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    }

    function getSavedAudioFileInAssetsFolder(filename){
        const protocol = window.location.protocol;
        const domainAndPort = window.location.host; // Includes domain and port if specified

        const fullUrl = `${protocol}//${domainAndPort}`;

        const audioUrl = fullUrl + '/assets/audio/' + `${filename}.wav`
        const audioDuration = localStorage.getItem(`${filename}-audioDuration`)
        const audioFile = localStorage.getItem(`${filename}-audioFile`)

        return {audioFile: audioFile, speakURL: audioUrl, audioDuration: audioDuration}
    }
      

    return {
        sleep,
        saveBlob,
        downloadAudio,
        getAudioDuration,
        startCountdown,
        filterAndLimit,
        removeElementAfterDelay,
        secondsToMillisecondsConverter,
        getSavedAudioFileInAssetsFolder,
        autoScrollParent,
        truncateString,
        isScrolledToBottom
    }

})();


export default helperFunctions;