document.getElementById('a').onclick = function(){
    // var bghref = chrome.extension.getBackgroundPage().location.href;
    // alert(bghref);
    // chrome.tabs.create({url:bghref},function(tab){})
    alert(chrome.extension.getViews().length);
    alert(chrome.extension.getBackgroundPage().clickIt)
}