var preurl2 = ''
var url2 = ''
var storage = chrome.storage
var initTime2 = (new Date).getTime();
var isSaved = false
var body = {}
var videoID = ''
var period2 = 1000, pauseCount2 = 0

function start() {
    // try {
        try {
            url2 = window.location.toString()
            var redLine = document.querySelector("body > ytd-app > yt-page-navigation-progress")
            var isdisplay = redLine.getAttribute("aria-valuenow") != 100 //讀取條看的到
        } catch (e) {}

        if (isdisplay && redLine.getAttribute("aria-valuenow") != null) { //等於null表示還沒跑過
            // console.log("看的到3")
        } else {
            if(url != 'https://www.youtube.com/'){
                countPauseCount2()
                // if (preurl2 == '' || preurl2== null) {
                //     saveData2()
                // }
                if (url2 != preurl2 && preurl2 != null && isSaved) {
                    sendDate2()
                } else { // 一樣
                    if(!isSaved){
                        saveData2()
                    }
                }
            }
        }
    // } catch (error) {
    //     console.log("error : " + error)
    // }
}

function saveData2() {
    reset2Data()
    console.log("saveData")
    initTime2 = (new Date).getTime()
    storage.sync.get('email', function (data) {
        var re = /watch\?v=[\-A-Za-z0-9_]*/
        var reChannel = /channel\/[\-A-Za-z0-9_]*/
        try {
            videoID = re.exec(url2)[0].replace('watch?v=', '')
            var scriptTag = JSON.parse(document.querySelector("#scriptTag").innerText)
            var channelName = document.querySelector("#text > a").innerText
            var channelID = document.querySelector("#text > a").href
            channelID = reChannel.exec(channelID)[0].replace('channel/', '')
            var videoTitle = scriptTag["name"]
            var duration = scriptTag['duration']
            var thumbnails = scriptTag['thumbnailUrl'][0]
            var viewCount = scriptTag['interactionCount']
            var uploadDate = scriptTag['uploadDate']
            var likeStatus = like_status();
            var manifestData = chrome.runtime.getManifest();
            var version = manifestData.version;
            body = {
                UUID: data.email,
                email: data.email,
                videoID: videoID,
                title: videoTitle,
                thumbnails: thumbnails,
                duration: duration,
                channelName: channelName,
                channelID: channelID,
                viewCount: viewCount,
                uploadDate: uploadDate,
                likeStatus: likeStatus,
                version: version
            }
            isSaved = true
            // console.log("saveData")
        } catch (e) {
            if(url2=='https://www.youtube.com/'){
                preurl2 = url2
            }else{
                preurl2 = null
                isSaved = false
                console.log("error : " + e)
            }
        }
    });

}
function reset2Data(){
    preurl2 = url2
    initTime2 = (new Date).getTime()
    pauseCount2 = 0
}
function countPauseCount2(){
    l = document.querySelector("#movie_player").classList
    if(!l.contains("playing-mode")){
        pauseCount2 += 1
    }
}

function like_status(){
    var c = document.querySelector("#menu-container").querySelectorAll("ytd-toggle-button-renderer")
    var like = c[0].classList.contains("style-default-active")
    var dislike = c[1].classList.contains("style-default-active")
    var re
    if(like)
        re = 1
    if(dislike)
        re = -1
    if(!like && !dislike)
        re = 0
    return re
}
function sendDate2() {
    var duration2 = +body["duration"].replace('PT','').replace('S','')
    var listenTime2 = ((new Date).getTime()-initTime2)/1000
    var pauseTime2 = pauseCount2 * period2/1000
    var re = listenTime2 - pauseTime2 <= duration2-10
    if(duration2==0){
        re = false
    }
    if (re) {
        if (typeof chrome.app.isInstalled !== undefined) {
            // console.log("not finish ")
            body["listenTime"] = listenTime2 - pauseTime2
            console.log(body)
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
setInterval(start, period2);