
// var mainInterval = null
// var NFInterval = null
var myInterval = null
var period = 1000
var preurl = null, preurl2 = null
var url = '', url2 = ''
var pauseCount = 0
window.onfocus = function() {
    // if(!mainInterval)
    //     mainInterval = setInterval(mainStart, period);
    // this.console.log("main "+like_status())
    // if(!NFInterval)
    //     NFInterval = setInterval(NFstart, period);
    // this.console.log("not "+like_status())
    if(!myInterval)
        myInterval = setInterval(startInterval, period);
}
function startInterval(){
    try {
        url = window.location.toString()
        url2 = window.location.toString()
        var redLine = document.querySelector("body > ytd-app > yt-page-navigation-progress")
        var isdisplay = redLine.getAttribute("aria-valuenow") != 100 //讀取條看的到
    } catch (e) {}

    if (isdisplay && redLine.getAttribute("aria-valuenow") != null) { //等於null表示還沒跑過
        // console.log("看的到3")
    } else {
        if(url != 'https://www.youtube.com/'){
            countPauseCount()
            mainStart()
        }
        NFstart()
    }
}

function countPauseCount(){
    l = document.querySelector("#movie_player").classList
    if(!l.contains("playing-mode")){
        pauseCount += 1
        pauseCount2 += 1
    }
}
function saveData(data, f){
    console.log("saveData from "+ f)
        var re = /watch\?v=[\-A-Za-z0-9_]*/
        var reChannel = /channel\/[\-A-Za-z0-9_]*/
        try {
            videoID = re.exec(url2)[0].replace('watch?v=', '')
            var scriptTag = JSON.parse(document.querySelector("#scriptTag").innerText)
            var channelName = document.querySelector("#top-row > ytd-video-owner-renderer").querySelector("#text > a").innerText
            var channelID = document.querySelector("#top-row > ytd-video-owner-renderer").querySelector("#text > a").href
            channelID = reChannel.exec(channelID)[0].replace('channel/', '')
            var videoTitle = scriptTag["name"]
            var duration = scriptTag['duration']
            var thumbnails = scriptTag['thumbnailUrl'][0]
            var viewCount = scriptTag['interactionCount']
            var uploadDate = scriptTag['uploadDate']
            var likeStatus = like_status();
            var manifestData = chrome.runtime.getManifest();
            var version = manifestData.version;
            storage.sync.set({
                videoID: videoID,
                videoTitle: videoTitle,
                thumbnails:thumbnails
            }, () => {
                // console.log(videoID);
                // console.log(videoTitle)
            })
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
                likeStatus:likeStatus,
                version: version
            }
            console.log("work" + "from "+ f)
            return {"body":body, 'error':null}
        } catch (e) {
            console.log("fail" + e + "from "+ f)
            return {"body":null, 'error':e}
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