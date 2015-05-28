var bg = chrome.extension.getBackgroundPage();
document.getElementById('J_config').value = bg.getConfig();
document.getElementById('J_config').onblur = function(){
	var configText = document.getElementById('J_config').value;
	console.log(configText)
    bg.setConfig(configText);
}
