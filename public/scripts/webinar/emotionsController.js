export const emotionsController = (function(){

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
    const emotionFiles = [
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

    function init(){
        emotionFiles.forEach(file => {
            for (const emotion in emotionKeywords) {
                if (emotionKeywords[emotion].some(keyword => file.includes(keyword))) {
                    emotions[emotion].push(file);
                    break; 
                }
            }
        });
    }

    return {
        init
    }

})()
export default emotionsController