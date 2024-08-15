import sceneController from './sceneController.js';
import { videoController } from './videoController.js';

export const observerController = (function(){

    var config = {  attributes: false, childList: true, subtree: false }
    //function to check for mutation events on a certain elemwnt
    function handleMutations(mutationList, observer){
        var latestMutation;

        for(let mutation of mutationList){
            if(!latestMutation || mutation.timestamp > latestMutation.timestamp){
                latestMutation = mutation;

                mutation.addedNodes.forEach(node => {
                    if(node.nodeType === Node.ELEMENT_NODE){

                        if(node.id === 'player' && sceneController.getCurrentScene() === 'scene2'){
                            videoController.playVideo(videoController.getVideoId(videoController.getVideoIndex()))

                        }
                    }
                })
                observer.disconnect()
            }
        }
    }


    return {
        config,
        handleMutations,
    }
})();


export default observerController;