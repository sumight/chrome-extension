console.log('this is from target.js')

chrome.runtime.sendMessage(null,{meta:'getBlockMapList'});
chrome.runtime.onMessage.addListener(function(message) {
	if(message.meta === 'blockMapList'){
		var blockMapList = message.data
		console.log(blockMapList);
		mapDOMs(blockMapList,function(domMapList){
			chrome.runtime.sendMessage(null,{meta:'domMapList',data:domMapList});
		})
	}
});

chrome.runtime.sendMessage(null,{meta:'TDK',data:getTDK()});

/**
* 获取页面TDK
* @function getTDK
* @return {Object} 页面的TDK
*/
function getTDK(){
	var tdk = {}
	tdk.title = document.querySelector('title').innerText;
	tdk.description = document.querySelector('meta[name=description]').getAttribute("content");
	tdk.keywords = document.querySelector('meta[name=keywords]').getAttribute("content")
	return tdk;
}

/**
* 根据blockMapList条件映射列表，获取SOA xml条件和page dom的映射列表
* @function mapDOMs
* @param {Object} blockMapList SOAxml条件和pageQuery的映射
* @param {Function} cb 在映射全部完成之后调用,传入的参数为domMapList， SOAxml条件和pageDom的映射列表
*/
function mapDOMs(blockMapList, cb){
	var index = 0;
	var domMapList = [];
	mapDOM(blockMapList[index],cb);
	
	/**
	* 根据一个页面条件匹配一个页面DOM, 这是一个递归函数，递归的结束条件由index判断
	* @function mapDOM
	* @param {Object} blockMap 一个区块条件映射，从xml条件映射 到 页面条件
	* @param {Function} cb 在最后一个映射完成之后调用
	*/
	function mapDOM(blockMap, cb){
		if(!!blockMap.pageCondition.triggerQuery&&blockMap.pageCondition.triggerQuery!==""){
			// 如果条件中有触发器
			var trigger = document.querySelector(blockMap.pageCondition.triggerQuery);
			trigger.click();
			var pt = new PulseTrigger();
			document.addEventListener('DOMNodeInserted',function(){
				pt.pulse();
			},false);
			pt.start(500,function(){
				var domMap = {}
				domMap.xmlConditions = blockMap.xmlConditions;

				/* testStart replace off*/
				// domMap.htmlText = document.querySelector(blockMap.pageCondition.pageRangeQuery).innerText;
				domMap.htmlText = document.querySelector(blockMap.pageCondition.pageRangeQuery).innerHTML;
				/* testEnd */

				/* mapDOMs domMapList*/
				domMapList.push(domMap);
				/* mapDOMs index */
				index++
				/* mapDOMs blockMapList */
				if(index < blockMapList.length)
					mapDOM(blockMapList[index],cb);
				else
					cb && cb(domMapList);
			});
		}else{
			// 如果没有触发器
			var domMap = {}
			domMap.xmlConditions = blockMap.xmlConditions;
			domMap.htmlText = document.querySelector(blockMap.pageCondition.pageRangeQuery).innerHTML;
			/* mapDOMs domMapList*/
			domMapList.push(domMap);
			/* mapDOMs index */
			index++
			/* mapDOMs blockMapList */
			if(index < blockMapList.length)
				mapDOM(blockMapList[index],cb);
			else
				cb && cb(domMapList);
		}
	}
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