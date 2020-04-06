// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });
var videoTitle;
chrome.storage.sync.get(['email', 'videoID', 'videoTitle', 'thumbnails'], function (data) {
  if(data.email==''){
    document.getElementById("context").style.display = 'none'
    document.getElementById("error").style.display = 'block'
  }else{
    document.getElementById("context").style.display = 'block'
    document.getElementById("error").style.display = 'none'
    document.getElementById("email").innerText = data.email
    document.getElementById("videoID").innerText = data.videoID
    document.getElementById("videoTitle").innerText = data.videoTitle
    document.querySelector("#img > img").src = data.thumbnails
    // document.querySelector("#context > div.ex6-box").style.height = document.querySelector("#info").offsetHeight+"px"
    // var videoTitle = data.videoTitle || 'reload...'
    // if(videoTitle.length> 20){
    //   videoTitle = videoTitle.substring(0, 20)+'...';
    // }
    document.querySelector("#img").style.height = (document.querySelector("#context > div.outer").clientHeight+5)+"px"
  }
  var manifestData = chrome.runtime.getManifest();
  var version = manifestData.version;
  document.getElementById("test").innerText ="V"+version
});