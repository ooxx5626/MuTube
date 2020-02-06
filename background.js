const endpoint = "https://www.googleapis.com/youtube/v3/videos";
// V2.1
// add send info when half duration time
// add check tag is exist or not
// V2.2
// add shine Text when half duration time


// The API key below is not a secret. Generated with these settings:
// 
// * Where will you be calling the API from?  [ Web browser (JavaScript) ]
// * What data will you be accessing?         [ Public data              ]

// const key = "AIzaSyCaHWZYPuLv4cD6k-TQjg4Jx_1GQnG1wFw"; 
const key = "AIzaSyBpjlYzWiO339NWgZ71dGFv_pPMHMmvPSc";


chrome.identity.getProfileUserInfo(function (userinfo) {
  console.log("userinfo", userinfo);
  let email = userinfo.email;
  chrome.storage.sync.set({
    email: email
  }, function () {
    console.log('email is ' + email);
  })
});

chrome.runtime.onInstalled.addListener(function () {
  // chrome.storage.sync.set({
  //   color: '#3aa757'
  // }, function () {
  //   console.log('The color is green.');
  // });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'developer.chrome.com'
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {

  if (request.type == "addYTListenHistory") {
    fetchListenHistory(request.body)
      .then(msg => sendResponse({
        msg: msg
      }))
  }
  if (request.type == "tags") {
    body = request.body
    fetchCheckVideoInfo(request.body.id)
      .then(r => r == 'false' ?
        fetchTags(request.body.id)
        .then(t => {
          // sendResponse({tags: JSON.stringify(t)})
          body.tags = t
          delete body.UUID
          delete body.email
          fetchaddVideoInfo(body)
            .then(t => sendResponse({
              tags: JSON.stringify(t)
            }))
            .catch(e => sendResponse({
              error: "Error fetchaddVideoInfo tags: " + e
            }))
        })
        .catch(e => sendResponse({
          error: "Error fetchCheckVideoInfo tags: " + e
        })) :
        sendResponse({
          tags: "is exist " + r
        })
      )

  }
  if (request.type == "notFinish") {
    fetchNotFinish(request.body)
    .then(msg => sendResponse({
      msg: msg
    }))
  }

  return true; // tells the runtime not to close the message channel
});

const fetchNotFinish = body => {
  const url = 'https://mulink.ee.ncku.edu.tw/addYTNotFinishHistory';
  return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.text())
};
const fetchListenHistory = body => {
  const url = 'https://mulink.ee.ncku.edu.tw/addYTListenHistory';
  return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => response.text())
};

const fetchCheckVideoInfo = videoID => {
  const url = 'https://mulink.ee.ncku.edu.tw/checkVideoInfo';

  return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": videoID
      })
    })
    .then(response => response.text())
};

const fetchaddVideoInfo = body => {
  const url = 'https://mulink.ee.ncku.edu.tw/addVideoInfo';

  return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    // .then(r => r.json())
    .then(response => response.text())
};

/**
 * @param {String} videoID
 * 
 * @return {Promise.<String[]>}
 */
const fetchTags = videoID => {

  const url = `${endpoint}?part=snippet&fields=items(snippet(tags))&id=${encodeURIComponent(videoID)}&key=${key}`;
  return fetch(url)
    .then(r => r.json())
    .then(r => (r.items[0] && r.items[0].snippet.tags) || []);

};