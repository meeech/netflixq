//Doing this operation here instead of in pagescript.js, since we want to save in our own 
//localstorage, not in netflixes
var lStore = (('localStorage' in window) && window['localStorage'] !== null) ? window.localStorage : false ;

function getList() {
    return JSON.parse(lStore.getItem('NetflixQList'));
}

function saveList (toSave) {
    console.log('Save');
    lStore.setItem('NetflixQList', JSON.stringify(toSave));
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
        //Get Queue list
        var nq = getList() || {},
            id = request.id;
        //Add the requested one   
        nq[id] = request;
        saveList(nq);
        //Let the callee know what's up
        sendResponse(nq);
    }
);