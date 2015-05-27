var bg = chrome.extension.getBackgroundPage();
$('#J_open-config').on('click', function() {
    chrome.tabs.create({
        url: './source/config.html'
    }, function(tab) {})
})
$('#J_open-result').on('click', function() {
    chrome.tabs.create({
        url: './source/result.html'
    }, function(tab) {})
})
$('#J_start').on('click', function() {
   	bg.startTest();
})
