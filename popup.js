//這個檔案是在執行點擊套件後的畫面

'use strict';

// let changeColor = document.getElementById('changeColor');
// chrome.storage.sync.get('color', function(data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute('value', data.color);
// });

chrome.storage.sync.get(['email', 'videoID', 'videoTitle', 'thumbnails'], function (data) {
  var qrcode
  
  document.querySelector("#right > div:nth-child(1) > div > label > label").style.margin = "0px auto"
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
    document.querySelector("#img").style.height = (document.querySelector("#context > div.outer").clientHeight+5)+"px"
  }
  var manifestData = chrome.runtime.getManifest();
  var version = manifestData.version;
  document.getElementById("test").innerText ="V"+version
  var checkbox = document.querySelector("#menu-right")
  checkbox.addEventListener('change', function() {
    if(this.checked) { //是否顯示QR-code
      document.getElementById("qrcodebox").style.display = 'block'
      document.getElementById("context").style.display = 'none'
      if(!qrcode){
        qrcode = document.getElementById("qrcode") 
        new QRCode(qrcode, "http://140.116.72.65:3000/popularity/"+data.email);
        document.querySelector("#qrcode > img").style.margin = "0px auto"
      }
    } else {
      document.getElementById("qrcodebox").style.display = 'none'
      document.getElementById("context").style.display = 'block'
    }
});
});
