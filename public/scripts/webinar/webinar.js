import { sceneController } from "./sceneController.js"
import { videoController} from "./videoController.js"
import { animationController} from "./animationController.js"
import { youtubeChatController } from "./youtubeChatController.js"
import { llmController } from "./llmController.js"
import { openvoiceController } from "./openvoiceController.js"
import { currentWebinar } from "../constants/constants.js"
import { helperFunctions } from "../helper/helper.js"

function init(){
    videoController.init(currentWebinar)
    animationController.init()
    openvoiceController.init(animationController.frendStreamGlobalState)
    //Bind to global scope, needed by youtube iframe API
    videoController.playVideo(videoController.getVideoId(videoController.getVideoIndex()))

    sceneController.goToScene('scene1')
}


init()
