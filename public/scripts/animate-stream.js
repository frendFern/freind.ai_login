let frendStreamGlobalState

(async function(){
     frendStreamGlobalState= {
        canvas:{
            height:500,
            width:500
        },
        zoom:{max:0.5,min:4,rate:0.2},
    }

    const app = new PIXI.Application({
        view: document.getElementById("frend-canvas"),
        autoStart: true,
        backgroundAlpha: 0,
        height:frendStreamGlobalState.canvas.height,
        width:frendStreamGlobalState.canvas.width
    });
    frendStreamGlobalState.frend_pixi_app = app

    // frendStreamGlobalState.currentModel = "models/REM/REM.model3.json"
    frendStreamGlobalState.currentModel = "models/NirVer2/NirLiv2d.model3.json"


    const live2d = PIXI.live2d;

    async function drawModelToStage(modelObject){
        
        if(!modelObject){
            modelObject = frendStreamGlobalState.currentModel;
        }
        //Load model 
        frendStreamGlobalState.visableModel = await Promise.all([live2d.Live2DModel.from(modelObject)]);
        //Remove loading state

        //Draw them to stage
        await app.stage.addChild(frendStreamGlobalState.visableModel[0]);
        adjustModelSize();
        draggable(frendStreamGlobalState.visableModel[0]);
        bindInteractions(frendStreamGlobalState.visableModel[0])
        localStorage.setItem('isFirstMessage', 'true');
    }
    await drawModelToStage();

    function adjustModelSize(multiple){
        currentModel = frendStreamGlobalState.visableModel[0];
        if (!multiple){
            //Fits most screens
            multiple=1
        }
        frendStreamGlobalState.zoom.current = multiple;

        //Adjust model to fit canvas
                //step 1 get the ratio
        // r = w / h
        let ratio = currentModel.internalModel.originalWidth /  currentModel.internalModel.originalHeight; 

        //step 2 get max width
        let maxModelWidth = currentModel.internalModel.originalWidth < frendStreamGlobalState.canvas.width ? currentModel.internalModel.originalWidth : frendStreamGlobalState.canvas.width
        
        //step 3 multiply width by ratio to get height
        let maxModelHeight = maxModelWidth / ratio;


        currentModel.height = maxModelHeight/multiple;
        currentModel.width = maxModelWidth/multiple;
    }




//emotion categorization 
 
    const emotionKeywords = {
        happy: ["happy", "moved", "smile", "surprised", "bashful"],
        sad: ["sad", "suffering", "sulk", "sulky", "worried", "grieved", "troubled"],
        angry: ["angry", "serious"],
        normal: ["normal", "fresh", "nod", "select", "talk", "sigh", "thinking"]
    };
    const emotions = {
        happy: [],
        sad: [],
        angry: [],
        normal: [],
     
    };
    const files = [
        "models/REM/motions/act_angry_1.motion3.json",
        "models/REM/motions/act_angry.motion3.json",
        "models/REM/motions/act_angry2_1.motion3.json",
        "models/REM/motions/act_angry2.motion3.json",
        "models/REM/motions/act_fresh.motion3.json",
        "models/REM/motions/act_moved_1.motion3.json",
        "models/REM/motions/act_moved.motion3.json",
        "models/REM/motions/act_nod.motion3.json",
        "models/REM/motions/act_nod02.motion3.json",
        "models/REM/motions/act_normal_w.motion3.json",
        "models/REM/motions/act_normal02_w.motion3.json",
        "models/REM/motions/act_serious_1.motion3.json",
        "models/REM/motions/act_serious.motion3.json",
        "models/REM/motions/act_serious02_1.motion3.json",
        "models/REM/motions/act_serious02.motion3.json",
        "models/REM/motions/act_sigh.motion3.json",
        "models/REM/motions/act_sigh02.motion3.json",
        "models/REM/motions/act_smile_1.motion3.json",
        "models/REM/motions/act_smile.motion3.json",
        "models/REM/motions/act_smile2_1.motion3.json",
        "models/REM/motions/act_smile2.motion3.json",
        "models/REM/motions/act_smile02.motion3.json",
        "models/REM/motions/act_normal03_w.motion3.json",
        "models/REM/motions/act_fresh_1.motion3.json",
        "models/REM/motions/act_smile02_1.motion3.json",
        "models/REM/motions/act_suffering_1.motion3.json",
        "models/REM/motions/act_suffering.motion3.json",
        "models/REM/motions/act_sulk_1.motion3.json",
        "models/REM/motions/act_sulk.motion3.json",
        "models/REM/motions/act_surprised_1.motion3.json",
        "models/REM/motions/act_surprised.motion3.json",
        "models/REM/motions/act_surprised2_1.motion3.json",
        "models/REM/motions/act_thinking_1.motion3.json",
        "models/REM/motions/act_thinking.motion3.json",
        "models/REM/motions/act_surprised2.motion3.json",
        "models/REM/motions/act_worried_1.motion3.json",
        "models/REM/motions/act_worried.motion3.json",
        "models/REM/motions/add_select_C.motion3.json",
        "models/REM/motions/add_select_L.motion3.json",
        "models/REM/motions/add_select_R.motion3.json",
        "models/REM/motions/face_angry_1.motion3.json",
        "models/REM/motions/face_angry.motion3.json",
        "models/REM/motions/face_angry02.motion3.json",
        "models/REM/motions/face_angry03.motion3.json",
        "models/REM/motions/face_bashful_1.motion3.json",
        "models/REM/motions/face_cheek_off.motion3.json",
        "models/REM/motions/face_cheek_on.motion3.json",
        "models/REM/motions/face_fresh_1.motion3.json",
        "models/REM/motions/face_fresh.motion3.json",
        "models/REM/motions/face_grieved_1.motion3.json",
        "models/REM/motions/face_guilty_w.motion3.json",
        "models/REM/motions/face_guilty.motion3.json",
        "models/REM/motions/face_moved_1.motion3.json",
        "models/REM/motions/face_moved.motion3.json",
        "models/REM/motions/face_normal_w.motion3.json",
        "models/REM/motions/face_normal02_w.motion3.json",
        "models/REM/motions/face_normal03_w.motion3.json",
        "models/REM/motions/face_option01_off.motion3.json",
        "models/REM/motions/face_option01_on.motion3.json",
        "models/REM/motions/face_option02_off.motion3.json",
        "models/REM/motions/face_option02_on.motion3.json",
        "models/REM/motions/face_seriously_1.motion3.json",
        "models/REM/motions/face_seriously02_1.motion3.json",
        "models/REM/motions/face_smile_1.motion3.json",
        "models/REM/motions/face_smile.motion3.json",
        "models/REM/motions/face_smile2_1.motion3.json",
        "models/REM/motions/face_smile02_1.motion3.json",
        "models/REM/motions/face_smile2.motion3.json",
        "models/REM/motions/face_smile02.motion3.json",
        "models/REM/motions/face_smile3_1.motion3.json",
        "models/REM/motions/face_smile03_1.motion3.json",
        "models/REM/motions/face_smile4_1.motion3.json",
        "models/REM/motions/face_smile04_1.motion3.json",
        "models/REM/motions/face_smile04.motion3.json",
        "models/REM/motions/face_suffer_1.motion3.json",
        "models/REM/motions/face_suffer.motion3.json",
        "models/REM/motions/face_sulky_1.motion3.json",
        "models/REM/motions/face_sulky.motion3.json",
        "models/REM/motions/face_sulky2_1.motion3.json",
        "models/REM/motions/face_sulky2.motion3.json",
        "models/REM/motions/face_surprised_1.motion3.json",
        "models/REM/motions/face_surprised.motion3.json",
        "models/REM/motions/face_surprised2_1.motion3.json",
        "models/REM/motions/face_surprised02_1.motion3.json",
        "models/REM/motions/face_surprised2.motion3.json",
        "models/REM/motions/face_surprised02.motion3.json",
        "models/REM/motions/face_talk_large.motion3.json",
        "models/REM/motions/face_talk_normal.motion3.json",
        "models/REM/motions/face_talk_off.motion3.json",
        "models/REM/motions/face_talk_small.motion3.json",
        "models/REM/motions/face_thinking_1.motion3.json",
        "models/REM/motions/face_thinking.motion3.json",
        "models/REM/motions/face_troubled_1.motion3.json",
        "models/REM/motions/face_troubled.motion3.json",
        "models/REM/motions/face_worried_1.motion3.json",
        "models/REM/motions/face_worried.motion3.json"
    ]

    files.forEach(file => {
        for (const emotion in emotionKeywords) {
            if (emotionKeywords[emotion].some(keyword => file.includes(keyword))) {
                emotions[emotion].push(file);
                break; 
            }
        }
    });

    // files.forEach(file => {
    //     if (file.includes("happy") || file.includes("moved")  || file.includes("smile") || file.includes("surprised") || file.includes("bashful") || file.includes("moved"))  {
    //         emotions.happy.push(file);
    //     } else if (file.includes("sad")  || file.includes("suffering") || file.includes("sulk")  || file.includes("sulky") || file.includes("worried") || file.includes("grieved") || file.includes("troubled")) {
    //         emotions.sad.push(file);
    //     } else if (file.includes("angry") || file.includes("serious")) {
    //         emotions.angry.push(file);
    //     } else if (file.includes("normal") || file.includes("fresh") || file.includes("nod") || file.includes("select") || file.includes("talk") || file.includes("sigh") || file.includes("thinking")) {
    //         emotions.normal.push(file);
    //     } 
    // })

    console.log(emotions);


    function randomEmotion(){
        setEmotion(frendStreamGlobalState.visableModel[0]);
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

    //Make a random expression every 10 seconds
    setInterval(() => randomEmotion(), 10000);

    function zoomIn(){
        let rate = frendStreamGlobalState.zoom.rate
        let newZoom = frendStreamGlobalState.zoom.current - rate > frendStreamGlobalState.zoom.max ? frendStreamGlobalState.zoom.current - rate : frendStreamGlobalState.zoom.max;
        adjustModelSize(newZoom)
    }

    function zoomOut(){
        let rate = frendStreamGlobalState.zoom.rate
        let newZoom = frendStreamGlobalState.zoom.current + rate < frendStreamGlobalState.zoom.min ? frendStreamGlobalState.zoom.current + rate : frendStreamGlobalState.zoom.min;
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
        frendStreamGlobalState.visableModel[0].position.x=0
        frendStreamGlobalState.visableModel[0].position.y=0
        console.log()
        adjustModelSize(0)
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
    const frendControlZoomOut = document.getElementById('frend-control-zoom-out');
    const frendControlZoomIn = document.getElementById('frend-control-zoom-in');
    const frendControlReset = document.getElementById('frend-control-reset');
    const frendControlEmotion = document.getElementById('frend-control-emotion');
    const frendControlClose = document.getElementById('frend-control-close');
    
    function bindInteractions(model){
        model.on("click",(e)=>{
            setEmotion(model)
          })
    } 
    function closeControls(){
        document.getElementById('frend-controls').hidden = true
    }
    frendControlZoomOut.onclick = zoomOut;
    frendControlZoomIn.onclick = zoomIn;
    frendControlReset.onclick = reset;
    frendControlEmotion.onclick = randomEmotion;
    frendControlClose.onclick = closeControls;

})()
