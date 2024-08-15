let frendGlobalState={
    zoom:{max:0.5,min:4,rate:0.2},
    frend_api_url: "http://192.168.0.100:6002",
    audio: {},
    chat: {},
    animate: {}
};
(function(){

    let uuid = localStorage.getItem('uuid');

    if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem('uuid', uuid);
    }

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    frendGlobalState.userid=uuid

    const avatarToModel = {
        "Shiba" : "models/shiba/shiba.model3.json",
        "Katie" : "models/katie/YelloJacketGirl.model3.json",
        "2B" : "models/2b/2b.model3.json",
        "Chibi" : "models/chibi_costimzable2.0_marinki/costomizble_chibi2.0.model3.json",
        "Kat" : "models/kat/free1.model3.json",
        "Santa" : "models/Santa3/Santa.model3.json",
        "Susan" : "models/haru/haru_greeter_t03.model3.json",
        "Hiyori" : "models/Hiyori/Hiyori.model3.json",
        "Mao" : "models/Mao/Mao.model3.json",
        "Marcus" : "models/Mark/Mark.model3.json",
        "Natori" : "models/Natori/Natori.model3.json",
        "Rona" : "models/Rice/Rice.model3.json",
        "Rem" : "models/REM/REM.model3.json",
        "Ram" : "models/RAM/RAM/RAM.model3.json",
        "Beatrice": "models/BeatricePoolParty/Beatrice-Pool-Party/Beatrice-Pool-Party.model3.json",
        "Anastasia": "models/Anastasia_Party/Anastasia_Party.model3.json",
        "Russell": "models/Russell-Fellow/Russell-Fellow.model3.json",
        "Julius": "models/Julius/Julius.model3.json",
        "Kadomon": "models/Kadomon_Risch/Kadomon_Risch.model3.json",
        "Neyra": "models/Neyra5/NeyraVer5.model3.json",
        "Wendy": "models/WendyLive2D2/WendyLive2d0.model3.json",
        "NirVer": "models/NirVer2/NirLiv2d.model3.json"
        
    }
    localStorage.setItem('avatarToModel', JSON.stringify(avatarToModel))
    localStorage.setItem('isFirstMessage', "false");
    localStorage.setItem('currentAvatar', "Rice");
    localStorage.setItem("lastRendered", new Date().toString());
    frendGlobalState.speaking=false
    frendGlobalState.totalTimerSeconds = 0;
    frendGlobalState.cached = true;

    frendGlobalState.frend_questions = []
    
    frendGlobalState.neyraQuestions = []
    

})();
