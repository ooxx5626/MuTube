
var storage = chrome.storage
var initTime = (new Date).getTime();
var isSend = 0, error = false, debug = true
var sendMode = 0
// 0 : can repeat and 1 min
// 1 : half duration
// 2 : debug 5s
var body = {}
var TAG1 = "main"
var videoID = '', documentTitle = ''
var myInterval = null
function mainStart() {
    if (url != preurl && url.indexOf('https://www.youtube.com/watch?v=') == '0') {
        resetDataMain()
        saveDataMain()
    } else if (!error){
        sendDateMain()
    }
}
function resetDataMain(){
    // console.log("resetDataMain")
    preurl = url
    initTime = (new Date).getTime()
    isSend = 0
    pauseCount = 0
    documentTitle = document.title
}
function saveDataMain() {
    storage.sync.get('email', function (data) {
        console.log("work")
        data = saveData(data, TAG1)
        if(!data['error']){
            error = false;
            body = data['body']
        }else {
            if(url=='https://www.youtube.com/'){
            }else{
                error = true;
                preurl = null //不這樣做就無法再次進行document.querySelector("#scriptTag").innerText
                console.log("error : "+data['error'])
            }
        }
    })
}
function sendDateMain() {
    if(sendJudge()) {
        body['likeStatus'] = like_status();
        body['listenTiming'] = initTime
        console.log(body)
        if (typeof chrome.app.isInstalled !== undefined) {
            isSend += 1
            pushToStorageAndSend(body['email'], body, TAG1)
            chrome.runtime.sendMessage({
                    type: "addYTListenHistory",
                    body
                }, r => r.msg ?
                console.log("addYTListenHistory : "+r.msg) :
                console.log("error"));
                // document.title = 'Add Listen History success'
                addMessageShine()
            chrome.runtime.sendMessage({
                    type: "tags",
                    body
                }, r => r.tags ?
                console.log("tags : "+r.tags) :
                console.log(r.error));
                
            chrome.runtime.sendMessage({
                type: "aboutComment",
                body
            }, r => r.msg ?
            console.log("aboutComment : "+r.msg) :
            console.log(r.error));

        }else{
            console.log("typeof chrome.app.isInstalled === undefined")
        }
        
    }

}
function sendJudge(){
    var re
    var duration = +body["duration"].replace('PT','').replace('S','')
    var listenTime = ((new Date).getTime()-initTime)/1000
    var pauseTime = pauseCount * period/1000
    if(debug){
        // x = document.querySelector("#autoplay").innerText
        // if(x!='自動播放'){
        //     listenTime = +x
        // }
        // document.querySelector("#upnext").innerText = listenTime+" "+isSend
        // console.log("listenTime : "+listenTime)
        // console.log("listenTime - duration*isSend - pauseTime : "+ (listenTime - duration*isSend - pauseTime))
        // document.querySelector("#upnext").innerText = listenTime + " " + duration +  " "+isSend+" " + pauseTime
    }
    if(sendMode == 0){// can repeat and 1 min
        re = listenTime - duration*isSend - pauseTime >= 60

    }else if(sendMode == 1){// half
        re = listenTime*2 >= duration && !isSend

    }else if(sendMode == 2){//debug 5s
        re = listenTime >= 10000/2000 && !isSend
    }
    if(duration==0){//live
        re = false
    }
    return re
}
function addMessageShine(){
    var startTime = (new Date).getTime()
    // console.log("startTime :"+startTime)
    var shine = true
    var addMessageTask = setInterval(()=>{
        if((new Date).getTime() - startTime > 12000){
            // alert(documentTitle)
            document.title = documentTitle
            clearInterval(addMessageTask);
            return;
        }
        // console.log("documentTitle :"+documentTitle)
        // console.log("(new Date).getTime() :"+(new Date).getTime())
        // console.log("shine :"+shine)
        shine? document.title = 'Add Listen History success':document.title = documentTitle
        shine = !shine
    }, 1000);
}
// window.onfocus = function() {
//     // if(!myInterval)
//     //     myInterval = setInterval(start, period);
//     storage.sync.get('email', function (data) {
//     this.console.log("main " + JSON.stringify(saveData()))
//     })
// }
