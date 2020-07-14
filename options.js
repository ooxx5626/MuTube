// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
var secret = ['#4688f1', '#4688f1', '#f9bb2d', '#3aa757', '#e8453c'];
var user = []
var bingo = true
function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      // chrome.storage.sync.set({color: item}, function() {
      //   console.log('color is ' + item);
      // })
      
      user.push(item)
      // console.log(user)
      bingo = true
        var userLength = user.length
        var secretLength = secret.length;
        for (var i = 0; i < secretLength; i++) {
            if(user[userLength-5+i]!=secret[i])
              bingo =false
        }
        if(bingo){
          console.log('show')
          document.querySelector("#secret").style.display = 'block'
        }
    });
    page.appendChild(button);
  }
}
constructOptions(kButtonColors);
