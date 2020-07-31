/*
這個js是用來執行ListenHistory的運作的

*/

var storage = chrome.storage
var initTime = (new Date).getTime();
var sendCount = 0 //資料送出次數
var error = false
var sendMode = 0
// 0 : can repeat and 1 min
// 1 : half duration
// 2 : debug 5s
var sendTiming = initTime
var body = {}
var TAG1 = "main"
var documentTitle = ''
function mainStart() {
    if (url != preurl && url.indexOf('https://www.youtube.com/watch?v=') == '0') { 
        resetDataMain()
        saveDataMain()
    } else if (!error){
        sendDataMain()
    }
}
function resetDataMain(){//清除上一筆video的data
    // console.log("resetDataMain")
    preurl = url
    initTime = (new Date).getTime()
    sendTiming = initTime
    sendCount = 0
    pauseCount = 0
    documentTitle = document.title
}
function saveDataMain() {//紀錄這筆video的data
    storage.sync.get('email', function (data) {
        console.log("work")
        data = saveData(data, TAG1)
        if(!data['error']){
            error = false;
            body = data['body']
        }else if(url!='https://www.youtube.com/'){
            error = true;
            preurl = null //不這樣做就無法再次進行document.querySelector("#scriptTag").innerText
            console.log("error : "+data['error'])
        }
    })
}
function sendDataMain() {
    if(sendJudge()) { //判斷是否送出
        body['likeStatus'] = like_status();
        body['listenTiming'] = sendTiming // init is initTime
        console.log(body)
        if (typeof chrome.app.isInstalled !== undefined) {//先確認chrome的套件有無問題
            sendCount += 1
            sendTiming = (new Date).getTime();
            // pushToStorageAndSend(body['email'], body, TAG1)
            chrome.runtime.sendMessage({
                    type: "addYTListenHistory",
                    body
                }, r => r.msg ?
                console.log("addYTListenHistory : "+r.msg) : console.log("error"));
                titleRemind()
            
            chrome.runtime.sendMessage({
                    type: "tags",
                    body
                }, r => r.tags ?
                console.log("tags : "+r.tags) : console.log(r.error));
                
            chrome.runtime.sendMessage({
                type: "aboutComment",
                body
            }, r => r.msg ?
                console.log("aboutComment : "+r.msg) : console.log(r.error));
            
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
    if(sendMode == 0){// can repeat and 1 min
        repeatDOM = document.querySelector("body > div.ytp-popup.ytp-contextmenu > div > div > div:nth-child(1)")
        repeat = repeatDOM? repeatDOM.getAttribute("aria-checked")=="true": false //重複播放有打勾
        re = listenTime - duration*sendCount - pauseTime >= 60 
        re = re && (new Date).getTime() - sendTiming >= 60 //保險起見上一次送出的時間至少跟這一次要大餘60秒
        if(sendCount>=1){ //如果送出的次數大餘1 就要檢查DOM的重複播放
            re = repeat && re
        }
    }else if(sendMode == 1){// half
        re = listenTime*2 >= duration && !sendCount

    }else if(sendMode == 2){//debug 5s
        re = listenTime >= 10000/2000 && !sendCount
    }
    if(duration==0){//live
        re = false
    }
    return re
}

function titleRemind(){ 
    var startTime = (new Date).getTime()
    var remind = true
    var addMessageTask = setInterval(()=>{
        if((new Date).getTime() - startTime > 12000){
            document.title = documentTitle
            clearInterval(addMessageTask);
            return;
        }
        remind? document.title = 'Add Listening record success':document.title = documentTitle
        remind = !remind
    }, 1000);
}