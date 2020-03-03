var preurl2 = ''
var url2 = ''
var storage = chrome.storage
var initTime2 = (new Date).getTime();
var isSaved = false
var body = {}
var videoID = '',
    documentTitle = ''

function start() {
    try {
        try {
            url2 = window.location.toString()
            var redLine = document.querySelector("body > ytd-app > yt-page-navigation-progress")
            var isdisplay = redLine.getAttribute("aria-valuenow") != 100 //讀取條看的到
        } catch (e) {}

        if (isdisplay && redLine.getAttribute("aria-valuenow") != null) { //等於null表示還沒跑過
            // console.log("看的到3")
        } else {
            if (preurl2 == '') {
                // console.log("url==")
                saveData()
            }
            if (url2 != preurl2) {
                sendDate()
            } else { // 一樣

                if (!isSaved) {
                    saveData()
                } 
            }
        }
    } catch (error) {
        console.log("error : " + error)
    }
}

function saveData() {
    preurl2 = url
    initTime2 = (new Date).getTime()
    storage.sync.get('email', function (data) {
        var re = /watch\?v=[\-A-Za-z0-9_]*/
        try {
            videoID = re.exec(url)[0].replace('watch?v=', '')
            var scriptTag = JSON.parse(document.querySelector("#scriptTag").innerText)
            var videoTitle = scriptTag["name"]
            var duration = scriptTag['duration']
            var thumbnails = scriptTag['thumbnailUrl'][0]
            body = {
                UUID: data.email,
                email: data.email,
                id: videoID,
                title: videoTitle,
                thumbnails: thumbnails,
                duration: duration
            }
            isSaved = true
            // console.log("saveData")
        } catch (e) {
            preurl2 = null
            isSaved = false
            console.log("error : " + e)
        }
    });

}
function sendDate() {
    var listenTime = ((new Date).getTime() - initTime2) / 1000
    // if (listenTime <= +body["duration"].replace('PT', '').replace('S', '')/4) {
    if (listenTime <= +body["duration"].replace('PT', '').replace('S', '')-10) {
        if (typeof chrome.app.isInstalled !== undefined) {
            // console.log("not finish ")
            body["listenTime"] = listenTime
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
    preurl2 = url
}
setInterval(start, 1000);