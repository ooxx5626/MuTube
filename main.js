var preurl = ''
var url = ''
var storage = chrome.storage
var initTime = (new Date).getTime();
var period = 1000, isSend = 0, error = false, debug = true, pauseCount = 0
var sendMode = 0
// 0 : can repeat and 1 min
// 1 : half duration
// 2 : debug 5s
var body = {}
var videoID = '', documentTitle = ''
var myInterval = null
function start() {
    try {
        try {
            url = window.location.toString()
            var redLine = document.querySelector("body > ytd-app > yt-page-navigation-progress")
            // var isdisplay = window.getComputedStyle(redLine, null).display == "block" //看的到
            var isdisplay = redLine.getAttribute("aria-valuenow") != 100 //讀取條看的到
            // console.log(redLine)
            // console.log("getAttribute : "+redLine.getAttribute("aria-valuenow"))
            // console.log("isdisplay : "+isdisplay)
            // console.log("url : "+url)
            // console.log(((new Date).getTime()-initTime)/1000*2)
            // console.log(+body["duration"].replace('PT','').replace('S',''))
            // console.log(((new Date).getTime()-initTime)/1000*2  >= +body["duration"].replace('PT','').replace('S',''))
        } catch (e) {
        }
        
        if (isdisplay && redLine.getAttribute("aria-valuenow") !=null) {  //等於null表示還沒跑過
            console.log("看的到")
        } else {
            if(url != 'https://www.youtube.com/'){
                countPauseCount()
                if (url != preurl) {
                    resetData()
                    saveDataMain()
                } else if (!error){
                    sendDateMain()
                }
            }
        }
    } catch (error) {
        console.log("error : "+error) 
    }
}
function resetData(){
    preurl = url
    initTime = (new Date).getTime()
    isSend = 0
    pauseCount = 0
    documentTitle = document.title
}
function saveDataMain() {
    
    console.log("work")
    storage.sync.get('email', function (data) {
        var re = /watch\?v=[\-A-Za-z0-9_]*/
        var reChannel = /channel\/[\-A-Za-z0-9_]*/
        try {
            videoID = re.exec(url)[0].replace('watch?v=', '')
            error = false;
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
                console.log(videoID);
                console.log(videoTitle)
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
        } catch (e) {
            
            if(url=='https://www.youtube.com/'){
            }else{
            error = true;
            preurl = null //不這樣做就無法再次進行document.querySelector("#scriptTag").innerText
            console.log("error : "+e)
        }
    }
    });
}
function sendDateMain() {
    if(sendJudge()) {
        body['likeStatus'] = like_status();
        console.log(body)
        if (typeof chrome.app.isInstalled !== undefined) {
            isSend += 1
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
    if(duration==0){
        re = false
    }
    return re
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
function countPauseCount(){
    l = document.querySelector("#movie_player").classList
    if(!l.contains("playing-mode")){
        pauseCount += 1
    }
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
window.onfocus = function() {
    if(!myInterval)
        myInterval = setInterval(start, period);
}
