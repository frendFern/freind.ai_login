let frendStreamGlobalState

(async function(){
     frendStreamGlobalState= {
        canvas:{
            height: 750,
            width:750,
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

    // frendStreamGlobalState.currentModel = "models/Neyra3/Neyra Ver3.model3.json"
    
    frendStreamGlobalState.currentModel = "models/Neyra2V2/Neyra2V2.model3.json"

  

   

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
            multiple=0.65
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
                model.motion('hair', 0).then(result => result); //when setting motion, need to set name and index of file
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

    function hasExpressions(model){
        if(!model.internalModel.motionManager.settings.expression || 
            model.internalModel.motionManager.settings.expression.length == 0){
                return false;
        }
        else{
            return true;
        }
    }

    function bindInteractions(model){
        model.on("click",(e)=>{
            setEmotion(model)
          })
    } 


})()