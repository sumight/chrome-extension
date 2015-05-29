var host = 'dj.ly.com'
function setHost(_host){
	host = _host;
}
function getHost(){
	return host;
}

chrome.runtime.onMessage.addListener(function(message) {
	if(message.meta === "setHost"){
		console.log('setHost',message.data);
		setHost(message.data);
	}
	if(message.meta === "getHost"){
		console.log('getHost')
		chrome.tabs.query({
		    url: "http://www.ly.com/*"
		}, function(tabs) {
		    for (i = 0; i < tabs.length; i++) {
		        chrome.tabs.sendMessage(tabs[i].id, {meta:'host',data:getHost()});
		    }
		});		
	}
})

// chrome.tabs.query({
//     url: "http://"+host+"/*"
// }, function(tabs) {
//     for (i = 0; i < tabs.length; i++) {
//         chrome.tabs.sendMessage(tabs[i].id, {meta:'activeConfig',data:config.activity});
//     }
// });