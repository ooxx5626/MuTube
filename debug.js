
function test() {
    // if(!mainInterval)
    //     mainInterval = setInterval(mainStart, period);
    // this.console.log("main "+like_status())
    // if(!NFInterval)
    //     NFInterval = setInterval(NFstart, period);
    // this.console.log("not "+like_status())
    if(!s){
        s = true
        
    storage.sync.set({'continuous_videoInfo':[], 'continuous_videoType':[]}, ()=>{})
    // pushToStorageAndSend('RxV0faquwLI', 'testtt')
    i = document.createElement('input')
    i.id = 'test1'
    i2 = document.createElement('input')
    i2.id = 'test2'
    // i3 = document.createElement('input')
    // i3.id = 'test3'
    document.querySelector("#search-form").appendChild(i)
    document.querySelector("#search-form").appendChild(i2)
    // document.querySelector("#search-form").appendChild(i3)
    b = document.createElement('s')
    b.id = 'Finish'
    b.innerText = 'Finish'
    document.querySelector("#search-form").appendChild(b)
    document.querySelector("#Finish").addEventListener("click", t);
    document.querySelector("#Finish").style.background = '#ea9999'
    document.querySelector("#Finish").style.textDecoration = "none"

    w = document.createElement('s')
    w.id = 'NTFinish'
    w.innerText = 'NTFinish'
    document.querySelector("#search-form").appendChild(w)
    document.querySelector("#NTFinish").addEventListener("click", x)
    document.querySelector("#NTFinish").style.background = '#708fff'
    document.querySelector("#NTFinish").style.textDecoration = "none"

    }
}
