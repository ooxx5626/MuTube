// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
chrome.storage.sync.get(['email', 'videoID', 'videoTitle'], function (data) {
  if(data.email==''){
    document.getElementById("context").style.display = 'none'
    document.getElementById("error").style.display = 'block'
  }else{
    document.getElementById("context").style.display = 'block'
    document.getElementById("error").style.display = 'none'
    document.getElementById("email").innerText = data.email
    document.getElementById("videoID").innerText = data.videoID
    document.getElementById("videoTitle").innerText =data.videoTitle
    var videoTitle = data.videoTitle || 'reload...'
    if(videoTitle.length> 20){
      videoTitle = videoTitle.substring(0, 20)+'...';
    }
  }
  document.getElementById("test").innerText ="V2.4"
});
// changeColor.onclick = function(element) {
//   let color = element.target.value;
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.executeScript(
//         tabs[0].id,
//         {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   });
// };
