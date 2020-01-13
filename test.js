var preurl = ''
var url = ''
var storage = chrome.storage
var initTime = (new Date).getTime();
var isSend = false, error = false
var body = {}
var videoID = '', documentTitle = ''
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
            // console.log("看不到")
            if (url != preurl) {
                preurl = url
                initTime = (new Date).getTime()
                isSend = false
                documentTitle = document.title
                console.log("work")
                storage.sync.get('email', function (data) {
                    var re = /watch\?v=[\-A-Za-z0-9_]*/
                    try {
                        videoID = re.exec(url)[0].replace('watch?v=', '')
                        error = false;
                        var scriptTag = JSON.parse(document.querySelector("#scriptTag").innerText)
                        var videoTitle = scriptTag["name"]
                        var duration = scriptTag['duration']
                        var thumbnails = scriptTag['thumbnailUrl'][0]
                        storage.sync.set({
                            videoID: videoID,
                            videoTitle: videoTitle
                        }, () => {
                            console.log(videoID);
                            console.log(videoTitle)
                        })
                        body = {
                            UUID: data.email,
                            email: data.email,
                            id: videoID,
                            title: videoTitle,
                            thumbnails: thumbnails,
                            duration: duration
                        }
                    } catch (e) {error = true;
                        console.log("error")}
                });
            } else if (!error){
                if(((new Date).getTime()-initTime)/1000*2 >= +body["duration"].replace('PT','').replace('S','') && !isSend) {
                // } else if((new Date).getTime()-initTime >= 10000/2000 && !isSend) { //debug 5s
                    console.log(body)
                    if (typeof chrome.app.isInstalled !== undefined) {
                        isSend = true
                        chrome.runtime.sendMessage({
                                type: "addYTListenHistory",
                                body
                            }, r => r.addYTListenHistory ?
                            console.log("addYTListenHistory : "+r.addYTListenHistory) :
                            console.log("error"));
                            // document.title = 'Add Listen History success'
                            addMessage()
                        chrome.runtime.sendMessage({
                                type: "tags",
                                body
                            }, r => r.tags ?
                            console.log("tags : "+r.tags) :
                            console.log(r.error));
                    }
                    
                }
            }
        }
    } catch (error) {
        console.log("error : "+error) 
    }
}
function addMessage(){
    var startTime = (new Date).getTime()
    console.log("startTime :"+startTime)
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
setInterval(start, 3000);