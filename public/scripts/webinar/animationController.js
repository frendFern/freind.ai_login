//Drive the animation of the AI avatar

export const animationController = (function(){
    let frendStreamGlobalState= {
        canvas:{
            height:380,
            width:500
        },
        zoom:{max:0.5,min:4,rate:0.2},
        currentModel:"models/NirVer2/NirLiv2d.model3.json",
        canvasId:"frend-canvas"
    }

    async function init(){
        const app = new PIXI.Application({
            view: document.getElementById(frendStreamGlobalState.canvasId),
            autoStart: true,
            backgroundAlpha: 0,
            height:frendStreamGlobalState.canvas.height,
            width:frendStreamGlobalState.canvas.width
        });
        frendStreamGlobalState.frend_pixi_app = app

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
            enableDraggable(frendStreamGlobalState.visableModel[0]);
            bindInteractions(frendStreamGlobalState.visableModel[0])
            setModelControls();
            localStorage.setItem('isFirstMessage', 'true');
        }
        await drawModelToStage();
    }

    function adjustModelSize(multiple){
        frendStreamGlobalState.currentModel = frendStreamGlobalState.visableModel[0];
        if (!multiple){
            //Fits most screens
            multiple=1
        }
        frendStreamGlobalState.zoom.current = multiple;

        //Adjust model to fit canvas
                //step 1 get the ratio
        // r = w / h
        let ratio = frendStreamGlobalState.currentModel.internalModel.originalWidth /  frendStreamGlobalState.currentModel.internalModel.originalHeight; 

        //step 2 get max width
        let maxModelWidth = frendStreamGlobalState.currentModel.internalModel.originalWidth < frendStreamGlobalState.canvas.width ? frendStreamGlobalState.currentModel.internalModel.originalWidth : frendStreamGlobalState.canvas.width
        
        //step 3 multiply width by ratio to get height
        let maxModelHeight = maxModelWidth / ratio;


        frendStreamGlobalState.currentModel.height = maxModelHeight/multiple;
        frendStreamGlobalState.currentModel.width = maxModelWidth/multiple;
    }

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

    function resetModelSize(){
        frendStreamGlobalState.visableModel[0].position.x=0
        frendStreamGlobalState.visableModel[0].position.y=0
        console.log()
        adjustModelSize(0)
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
                model.motion('random')
            }
        }
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

    function resetEmotion(model){
        if(hasExpressions(model)){
            model.internalModel.motionManager.expressionManager.currentExpression.release()
        }
    }
    
    function intervalRandomEmotion(){
        setInterval(() => randomEmotion(), 10000);
    }

    function enableDraggable(model) {

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


    function setModelControls(){
        const frendControlZoomOut = document.getElementById('frend-control-zoom-out');
        const frendControlZoomIn = document.getElementById('frend-control-zoom-in');
        const frendControlReset = document.getElementById('frend-control-reset');
        const frendControlEmotion = document.getElementById('frend-control-emotion');
        const frendControlClose = document.getElementById('frend-control-close');
        
         
        function closeControls(){
            document.getElementById('frend-controls').hidden = true
        }
        frendControlZoomOut.onclick = zoomOut;
        frendControlZoomIn.onclick = zoomIn;
        frendControlReset.onclick = resetModelSize;
        frendControlEmotion.onclick = randomEmotion;
        frendControlClose.onclick = closeControls;
    }
    function bindInteractions(model){
        model.on("click",(e)=>{
            setEmotion(model)
          })
    }

    return {
        init,
        adjustModelSize,
        randomEmotion,
        resetEmotion,
        setEmotion,
        intervalRandomEmotion,
        zoomIn,
        zoomOut,
        resetModelSize,
        frendStreamGlobalState
    }
})()
export default animationController