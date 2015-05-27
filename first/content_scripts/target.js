console.log('this is from target.js')

chrome.runtime.sendMessage(null,{meta:'getBlockMapList'});
chrome.runtime.onMessage.addListener(function(message) {
	if(message.meta === 'blockMapList'){
		var blockMapList = message.data

	}
});

// 根据区块配置列表获取对应的Node对象
function mapDOM(blockMapList){
	var domMapList = [];
	for(var index in blockMapList){
		var blockMap = blockMapList[index];
		if(!!blockMap.triggerQuery&&blockMap.triggerQuery!==""){
			var trigger = document.querySelector(blockMap.triggerQuery);
			trigger.click();
		}
		var domMap = {}
	}
}
