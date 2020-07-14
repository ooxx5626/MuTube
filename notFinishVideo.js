// var preurl2 = ''
// var url2 = ''
var storage = chrome.storage
var initTime2 = (new Date).getTime();
var isSaved = false
var body = {}
var TAG2 = "notFinishVideo"
var videoID = ''
function NFstart() {
    if (url2 != preurl2 && preurl2 != null && isSaved) {//播放頁面改了並且資料有被儲存
        sendDate2()
    } else { // 一樣
        if(!isSaved  && (url.indexOf('https://www.youtube.com/watch?v=') == '0' || url.indexOf('https://www.youtube.com/') == '0')){ //如果資料還沒被儲存並且在播放頁
            resetDataNF()
            saveData2()
            initTime2 = (new Date).getTime()
        }
    }
}

function saveData2() {
    storage.sync.get('email', function (data) {
        // console.log("saveData")
        data = saveData(data, TAG2)
        if(!data['error']){
            body = data['body']
            isSaved = true
        }else {
            if(url2=='https://www.youtube.com/'){
                preurl2 = url2
            }else{
                preurl2 = null
                isSaved = false
                console.log("error : " + data["error"])
            }
        }
    })
}
function resetDataNF(){
    // console.log("resetDataNF")
    preurl2 = url2
    initTime2 = (new Date).getTime()
    pauseCount2 = 0
}

function sendDate2() {
    var duration2 = +body["duration"].replace('PT','').replace('S','')
    var listenTime2 = ((new Date).getTime()-initTime2)/1000
    var pauseTime2 = pauseCount2 * period/1000
    var re = listenTime2 - pauseTime2 <= duration2-10
    if(duration2==0){
        re = false
    }
    if (re) {
        if (typeof chrome.app.isInstalled !== undefined) {
            body["listenTime"] = listenTime2 - pauseTime2
            body['listenTiming'] = initTime2
            console.log(body)
            pushToStorageAndSend(body['email'],body, TAG2)
            chrome.runtime.sendMessage({
                    type: "notFinish",
                    body
                }, r => r.msg ?
            console.log("addnotFinish : "+r.msg) :
            console.log("error"));
        }
    }else{
        console.log("is finish")
    }
    isSaved = false
    preurl2 = url2
}
