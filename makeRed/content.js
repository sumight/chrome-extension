if(document.location.host==="www.ly.com"){
	console.log('www')
	chrome.runtime.sendMessage(null,{meta:'getHost'})
	chrome.runtime.onMessage.addListener(function(message) {
		if(message.meta === "host"){
			document.location.host = message.data;
		}
	})
}else{
	document.onclick = function(){
		console.log('click');
		chrome.runtime.sendMessage(null,{meta:'setHost',data:document.location.host})
	}
}
