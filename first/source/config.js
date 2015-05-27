document.getElementById('abc').onclick = function() {
    var bghref = chrome.extension.getBackgroundPage().location.href;
    chrome.tabs.create({url:bghref},function(tab){})
}
