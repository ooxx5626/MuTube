var preurl = ''
var url = ''
var storage = chrome.storage

function start() {
    url = window.location.toString()
    var line = document.querySelector("body > ytd-app > yt-page-navigation-progress")
    var isdisplay = window.getComputedStyle(line).display == "block" //看的到
    if (isdisplay) {
        console.log("看的到")
    } else {
        // console.log("看不到")
        if (url != preurl) {
            preurl = url
            storage.sync.get('email', function (data) {
                var re = /watch\?v=[\-A-Za-z0-9_]*/
                var videoID = re.exec(url)[0].replace('watch?v=', '')
                console.log(document.querySelector("#scriptTag").innerText)
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
                var body = {
                    UUID: data.email,
                    email: data.email,
                    id: videoID,
                    title: videoTitle,
                    thumbnails: thumbnails,
                    duration: duration
                }
                console.log(body)
                const request = new Request('https://mulink.ee.ncku.edu.tw/addYTListenHistory');
                fetch(request, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    })
                    .then(response => response.text())
                    .then(blob => {
                        console.log(blob)
                    });
            });
        } else {
            // console.log("not work")
        }
    }
}
setInterval(start, 3000);