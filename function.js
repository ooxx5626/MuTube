/*
這個js是最先執行並啟動notFinishVideo和main的，其中還包含多個not 和main都有使用到的function

*/
var isStart = false
var period = 1000 //執行間隔
var preurl = null, preurl2 = null
var url = '', url2 = ''
var pauseCount = 0, pauseCount2 = 0
var storage = chrome.storage

focusCheck = setInterval(function() { // 程式運作最先跑的地方(頁面要被focus後才能開始啟動)
    if(document.hasFocus()){// 處理開新分頁並且在背景時YouTube不會自動運行的問題
        if(!isStart)
            isStart = setInterval(startInterval, period); 
        clearInterval(focusCheck)
    }
},1000);

function startInterval(){//主程式運作
    // test()
    try {//處理網址以及讀取條 
        url = window.location.toString()
        url2 = window.location.toString()
        var loadBar = document.querySelector("body > ytd-app > yt-page-navigation-progress")
        var loadBar_isdisplay = loadBar.getAttribute("aria-valuenow") != 100 //讀取條看的到
    } catch (e) {}

    if (loadBar_isdisplay && loadBar.getAttribute("aria-valuenow") != null) { //等於null表示還沒跑過
    } else {
        if(url.indexOf('https://www.youtube.com/watch?v=') == '0'){ //如果在播放頁面的話就執行listenHistory的運作 
            countPauseCount()//計算暫停(沒播放)次數
            mainStart()//開始跑listenHistory
            NFstart()//開始跑NotFinishHistory
        }
    }
}

function countPauseCount(){//計算暫停(沒播放)次數
    l = document.querySelector("#movie_player").classList
    if(!l.contains("playing-mode")){
        pauseCount += 1
        pauseCount2 += 1
    }
}
function saveData(data, TAG){
    console.log("saveData from "+ TAG)
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
        var version = chrome.runtime.getManifest().version;
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
        console.log("work from "+ TAG)
        return {"body":body, 'error':null}
    } catch (e) {
        console.log("fail" + e + "from "+ TAG)
        return {"body":null, 'error':e}
    }
}


function like_status(){ // likie: 1, dislike: -1 None: 0
    var container = document.querySelector("#menu-container").querySelectorAll("ytd-toggle-button-renderer")
    var like = container[0].classList.contains("style-default-active")
    var dislike = container[1].classList.contains("style-default-active")
    var re
    if(like)
        re = 1
    if(dislike)
        re = -1
    if(!like && !dislike)
        re = 0
    return re
}

// function pushToStorageAndSend(email, videoInfo, from){
//     isFinish = from == 'main'?true:false
//     var fake = false
//     if(!isFinish){
//         fake = videoInfo['listenTime'] >= 60
//     }
//     videoInfo={
//         videoID: videoInfo["videoID"],
//         title: videoInfo["videoTitle"],
//         duration: videoInfo["duration"],
//         channelName: videoInfo["channelName"],
//         channelID: videoInfo["channelID"],
//         listenTime: videoInfo['listenTime']
//     }
//     storage.sync.get(['continuous_videoInfo', 'continuous_videoType'], (data) => {
//         continuous_videoInfo = data['continuous_videoInfo']||[]
//         continuous_videoType = data['continuous_videoType']||[]
//         lastVideoInfo = continuous_videoInfo[continuous_videoInfo.length - 1]
//         if( !Boolean(lastVideoInfo) || lastVideoInfo['videoID'] != videoInfo['videoID'] || isFinish){
//             if(isFinish){ 
//                 //append main
                
//                 continuous_videoInfo.push(videoInfo)
//                 continuous_videoType.push(isFinish)
//             }else{// 這次的是 NTFinish (只要是NTFinish最後都將被clear)
//                 if( continuous_videoType[continuous_videoType.length-1] && continuous_videoType[continuous_videoType.length-2]){//最後一項和最後第二項都是main
//                     // append NTFinish and send

//                     if(fake){//當作有聽完
//                         console.log('fake')
//                         continuous_videoInfo.push(videoInfo)
//                         continuous_videoType.push(true)
//                     }else{
//                         continuous_videoInfo.push(videoInfo)
//                         continuous_videoType.push(isFinish)
//                     }
//                     chrome.runtime.sendMessage({
//                             type: "addYTContiunousHistory",
//                             body:{
//                                 "email":email, 
//                                 "UUID":email, 
//                                 "continuous_videoInfo":continuous_videoInfo
//                             }
//                         }, r => r.msg ?
//                         console.log("addYTContiunousHistory : "+r.msg) :
//                         console.log("error"));
//                     console.log("addYTContiunousHistory")
//                 }
//                 //只要是NTFinish最後都將被clear
//                 continuous_videoInfo = []
//                 continuous_videoType = []
//             }

//             storage.sync.set({
//                 "continuous_videoInfo" : continuous_videoInfo, 
//                 "continuous_videoType" : continuous_videoType
//             }, () => {
//                 // console.log("continuous_videoInfo : "+JSON.stringify(continuous_videoInfo));
//                 // console.log("continuous_videoType : "+continuous_videoType);
//             })
//         }else{
//             console.log(videoInfo['videoID'] + " is NOTlistenFinish")
//         }
//     })
// }

// function t(){
//     v1 = document.querySelector("#test1").value
//     pushToStorageAndSend('Email', {'videoID' : v1, 'listenTime' : 61}, 'main')
//     // console.log('v1 : '+ v1)
// }
// function x(){
//     v2 = document.querySelector("#test2").value
//     pushToStorageAndSend('Email', {'videoID' : v2, 'listenTime' : 50}, 'NFinish')
//     // console.log('v2 : '+ v2)
// }

// for(e of document.getElementsByClassName("_3oh- _58nk")) e.innerText = '我要讓OO多念一年'
