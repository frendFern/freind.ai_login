(async function(){
    let isRendering = false;
    frendGlobalState.frend_api_url = "https://d2141ekkpgdi0u.cloudfront.net"
    frendGlobalState.canvas= { height:600,
                                width:600}

    const app = new PIXI.Application({
        view: document.getElementById("frend-canvas"),
        autoStart: true,
        backgroundAlpha: 0,
        height:frendGlobalState.canvas.height,
        width:frendGlobalState.canvas.width
    });
    frendGlobalState.frend_pixi_app = app

    if(!frendGlobalState.currentModel){
        const url = new URL(window.location.href);
        const avatarName = url.searchParams.get("avatar");
        const avatarToModel = JSON.parse(localStorage.getItem('avatarToModel') || "{}")

        frendGlobalState.currentModel = avatarToModel[avatarName] || "models/REM/REM.model3.json"

    

        console.log("model is " + frendGlobalState.currentModel)

        

        localStorage.setItem('currentAvatar', avatarName === null ? 'Rem' : avatarName);
    }

    const live2d = PIXI.live2d;
    const inputBox = document.getElementById("frend-chat-screen-input-type");
    const inputBoxButton = document.getElementById("frend-chat-screen-input-button");
    const loadingDiv = document.getElementById('frend-loading');
    const aiIsTypingControl = document.getElementById("frend-input-loading");

    const loading = (isLoading) => {
        if (isLoading){
            inputBox.disabled = true;
            inputBoxButton.disabled = true;
            loadingDiv.classList.remove('hidden')
            aiIsTypingControl.classList.add("hidden")

            // Disable prompts
            const prompts = document.querySelectorAll(".prompt-button");
            for (let prompt of prompts){
                prompt.disabled = true
                prompt.classList.add("bg-neutral-700", "rounded-md", "cursor-not-allowed")
            }
        }else{
            inputBox.disabled = false;
            inputBoxButton.disabled = false;
            loadingDiv.classList.add('hidden')

            // Enable back prompts
            const prompts = document.querySelectorAll(".prompt-button");
            for (let prompt of prompts){
                prompt.disabled = false
                prompt.classList.remove("bg-neutral-700", "rounded-md", "cursor-not-allowed")
            }
        }
    }
    const chatScreenHistory = document.getElementById('frend-chat-screen-history-msgs');

    const clearConversation = () => {
        while (chatScreenHistory && chatScreenHistory.childNodes.length > 2) {
          chatScreenHistory.removeChild(chatScreenHistory.lastChild)
        }
    }

    async function drawModelToStage(modelObject){
        
        if(!modelObject){
            modelObject = frendGlobalState.currentModel;
        }
        //Remove any model on stage
        if (frendGlobalState.visableModel){
            app.stage.removeChild(frendGlobalState.visableModel[0]);
        }
        //Set loading state
        loading(true)
        //Load model 
        frendGlobalState.visableModel = await Promise.all([live2d.Live2DModel.from(modelObject)]);
        //Remove loading state
        loading(false)

        //Draw them to stage
        await app.stage.addChild(frendGlobalState.visableModel[0]);
        adjustModelSize();
        draggable(frendGlobalState.visableModel[0]);
        bindInteractions(frendGlobalState.visableModel[0])
        localStorage.setItem('isFirstMessage', 'true');
    }
    await drawModelToStage();

    function bindInteractions(model){
        model.on("click",(e)=>{
            setEmotion(model)
          })
    }

    document.querySelectorAll(".frend-select").forEach(async function (modelOption) {
        await modelOption.addEventListener("click", async function () {
            if (isRendering){
                return;
            }
            isRendering = true;
            localStorage.setItem("lastRendered", new Date().toString())
            frendGlobalState.visableModel[0].stopSpeaking();
            clearConversation();
            await drawModelToStage(this.getAttribute("model"));

            const avatarName = this.querySelector("p").innerHTML.trim()
            localStorage.setItem('currentAvatar', avatarName);
            isRendering = false;
        });
    });

    function adjustModelSize(multiple){
        currentModel = frendGlobalState.visableModel[0];
        if (!multiple){
            //Fits most screens
            multiple=1
        }
        frendGlobalState.zoom.current = multiple;

        //Adjust model to fit canvas
                //step 1 get the ratio
        // r = w / h
        let ratio = currentModel.internalModel.originalWidth /  currentModel.internalModel.originalHeight; 

        //step 2 get max width
        let maxModelWidth = currentModel.internalModel.originalWidth < frendGlobalState.canvas.width ? currentModel.internalModel.originalWidth : frendGlobalState.canvas.width
        
        //step 3 multiply width by ratio to get height
        let maxModelHeight = maxModelWidth / ratio;


        currentModel.height = maxModelHeight/multiple;
        currentModel.width = maxModelWidth/multiple;
    }
    

    frendGlobalState.frendList = [
        "models/Santa3/Santa.model3.json",
        "models/katie/YelloJacketGirl.model3.json",
        "models/2b/2b.model3.json",
        "models/kat/free1.model3.json",
        "models/shiba/shiba.model3.json",
        "models/models/chibi_costimzable2.0_marinki/costomizble_chibi2.0.model3.json",
        "models/haru/haru_greeter_t03.model3.json",
        "models/Hiyori/Hiyori.model3.json",
        "models/Mao/Mao.model3.json",
        "models/RAM/RAM/RAM.model3.json",
        "models/REM/REM.model3.json",
        "models/BeatricePoolParty/Beatrice-Pool-Party/Beatrice-Pool-Party.model3.json",
        "models/Anastasia_Party/Anastasia_Party.model3.json",
        "models/Russell-Fellow/Russell-Fellow.model3.json",
        "models/Julius/Julius.model3.json",
        "models/Kadomon_Risch/Kadomon_Risch.model3.json",
        "models/Neyra5/NeyraVer5.model3.json"
    ]

    //Make a random expression every 10 seconds
    setInterval(() => randomEmotion(), 10000);

    function zoomIn(){
        let rate = frendGlobalState.zoom.rate
        let newZoom = frendGlobalState.zoom.current - rate > frendGlobalState.zoom.max ? frendGlobalState.zoom.current - rate : frendGlobalState.zoom.max;
        adjustModelSize(newZoom)
    }

    function zoomOut(){
        let rate = frendGlobalState.zoom.rate
        let newZoom = frendGlobalState.zoom.current + rate < frendGlobalState.zoom.min ? frendGlobalState.zoom.current + rate : frendGlobalState.zoom.min;
        adjustModelSize(newZoom)
    }

    function draggable(model) {
        model.buttonMode = true;
        model.on("pointerdown", (e) => {
          model.dragging = true;
          model._pointerX = e.data.global.x - model.x;
          model._pointerY = e.data.global.y - model.y;
        });
        model.on("pointermove", (e) => {
          if (model.dragging) {
            model.position.x = e.data.global.x - model._pointerX;
            model.position.y = e.data.global.y - model._pointerY;
          }
        });
        model.on("pointerupoutside", () => (model.dragging = false));
        model.on("pointerup", () => (model.dragging = false));
    }

    function reset(){
        frendGlobalState.visableModel[0].position.x=0
        frendGlobalState.visableModel[0].position.y=0
        console.log()
        adjustModelSize(0)
    }

    const frendControlZoomOut = document.getElementById('frend-control-zoom-out');
    const frendControlZoomIn = document.getElementById('frend-control-zoom-in');
    const frendControlReset = document.getElementById('frend-control-reset');
    const frendControlEmotion = document.getElementById('frend-control-emotion');
    
    
    frendControlZoomOut.onclick = zoomOut;
    frendControlZoomIn.onclick = zoomIn;
    frendControlReset.onclick = reset;
    frendControlEmotion.onclick = randomEmotion;
    
    function randomEmotion(){
        setEmotion(frendGlobalState.visableModel[0]);
    }

    function hasExpressions(model){
        if(!model.internalModel.motionManager.settings.expression || 
            model.internalModel.motionManager.settings.expression.length == 0){
                return false;
        }
        else{
            return true;
        }
    }

    function setEmotion(model,id){
        if (id){
        model.expression(id)
        }else{
            if(hasExpressions(model)){
                model.expression()
            }
            else{
                model.motion('random')
            }
        }
    }

    function resetEmotion(model){
        if(hasExpressions(model)){
            model.internalModel.motionManager.expressionManager.currentExpression.release()
        }
    }
    frendGlobalState.animate.resetEmotion = resetEmotion;
    frendGlobalState.animate.setEmotion= setEmotion;


})()