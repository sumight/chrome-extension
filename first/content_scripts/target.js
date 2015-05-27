console.log('this is from target.js')

chrome.runtime.sendMessage(null,{meta:'getBlockMapList'});
chrome.runtime.onMessage.addListener(function(message) {
	if(message.meta === 'blockMapList'){
		var blockMapList = message.data

	}
});

// 根据区块配置列表获取对应的Node对象
function mapDOMs(blockMapList){
	var domMapList = [];
	for(var index in blockMapList){
		var blockMap = blockMapList[index];
		if(!!blockMap.triggerQuery&&blockMap.triggerQuery!==""){
			var trigger = document.querySelector(blockMap.pageCondition.triggerQuery);
			trigger.click();
			var pt = new PulseTrigger();
			document.addEventListener('DOMNodeInserted',function(){
				pt.pulse();
			},false);
			pt.start(500,function(){
				var domMap = {}
				domMap.xmlCondition = blockMap.xmlCondition;
				domMap.dom = document.querySelector(blockMap.pageCondition.pageRangeQuery);
				domMapList.push(domMap);
			});
		}
	}
	// mapDOM 根据区块，匹配一个DOM，返回匹配的DOM

}


/**
* 脉冲触发器，每过一段时间，就向触发器发送脉冲信号来防止触发器触发。
* 一旦在一个阈值时间内触发器没有接收到脉冲，触发器立马触发。
* @class PulseTrigger
*/
function PulseTrigger(){
	// 触发器的阈值
	this.threshold;
	// 接近阈值所剩余的时间
	this.leftTime;
	// 触发后的回调函数
	this.cb;
	// 触发器进行检查阈值接近程度的频率
	this.updateFrequent = 100;
	// 计时器的钩子
	this.intervalTag;

	/**
	* 启动触发器
	* @method start
	* @param {Number} threshold 触发器的时间阈值
	* @param {Function} 触发器的触发后调用的函数
	*/
	this.start = function(threshold, cb){
		this.threshold = threshold;
		this.leftTime = threshold;
		this.cb = cb;
		var that = this;
		this.intervalTag = setInterval(function(){
			console.log(that.leftTime)
			that.leftTime -= that.updateFrequent;
			if(that.leftTime<0){
				clearInterval(that.intervalTag)
				that.cb();
			}
		},this.updateFrequent)
	}

	/**
	* 向触发器发送脉冲信号，更新触发器的阈值，防止触发器触发
	* @method pulse
	*/
	this.pulse = function(){
		this.leftTime = this.threshold;
	}
}