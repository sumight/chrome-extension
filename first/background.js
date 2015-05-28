/**
 * 存储测试配置信息
 * @property {Object} config
 */
var config = null;
var configText = '';
/**
 * 存储正常日志信息
 * @property {String} logs
 */
var logs = [];

/**
 * 存储错误日志信息
 * @property {String} errLogs
 */
var errLogs = [];

/**
* 一个列表，每个项目是一个映射，SOA xml条件 到 page html
* @property {Object} soaCdt_pageHtml_map
*/
var soaCdt_pageHtml_map = null;

/**
* SOA接口页面的 xml dom对象
* @property {Object} soaXmlDom
*/
var soaXmlDom = null

//==================test data=======
configText = '{\n'+
    '    "targetUrl": "http://www.ly.com/zhuanti/shuqi_dacu/duanwu.html",\n'+
    '    "pageMeta":{\n'+
    '\n'+
    '    },\n'+
    '    "activity": {\n'+
    '        "pageIndex": "1",\n'+
    '        "pageSize": "100",\n'+
    '        "activityId": "1194",\n'+
    '        "periodId": "1837",\n'+
    '        "pageId": ""\n'+
    '    },\n'+
    '    "productMap":{\n'+
    '    	"query":".product",\n'+
    '    	"fieldList":[\n'+
    '    		{\n'+
    '    			"htmlQuery":"",\n'+
    '    			"xmlTagName":""\n'+
    '    		}\n'+
    '    	]\n'+
    '    },\n'+
    '    "blockMapList":[\n'+
    '    	{\n'+
    '    		"xmlConditions":[{\n'+
    '    			"xmlTagName":"MainTitle",\n'+
    '    			"xmlTagValue":"港澳4晚5日超值跟团游"\n'+
    '    		},\n'+
    '    		{\n'+
    '    			"xmlTagName":"DedicatLine",\n'+
    '    			"xmlTagValue":"端午"\n'+
    '    		}\n'+
    '    		],\n'+
    '    		"pageCondition":{\n'+
	'        		"triggerQuery":"li[data-areaid=\"3244\"] a",\n'+
	'        		"pageRangeQuery":"#part1"\n'+
    '    		}\n'+
    '    	},\n'+
    '    	{\n'+
    '    		"xmlConditions":[{\n'+
    '    			"xmlTagName":"SubTitle",\n'+
    '    			"xmlTagValue":"限量抢面值186元超大流量电话上网卡，赠送3D馆,船游璀璨香江，玩转海洋公园，乐享购物旅程。"\n'+
    '    		}],\n'+
    '    		"pageCondition":{\n'+
	'        		"triggerQuery":"li[data-areaid=\"3271\"] a",\n'+
	'        		"pageRangeQuery":"#part4"\n'+
    '    		}\n'+
    '    	}\n'+
    '    ]\n'+
    '}\n'
    //===============================


// 监听消息，根据消息对象的meta字段进行消息路由
chrome.runtime.onMessage.addListener(function(message) {
    if (message.meta === 'getActiveConfig') {
        chrome.tabs.query({
            url: "http://61.155.159.91:8208/InterVacation/Query/Debug.aspx"
        }, function(tabs) {
            for (i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, {meta:'activeConfig',data:config.activity});
            }
        });
    }
    if(message.meta === 'soaData'){
    	/* testStart add off*/
    	// alert('SOA数据提交成功'+message.data);
    	/* testEnd */
    	var domParser = new  DOMParser();
    	soaXmlDom = domParser.parseFromString(('<?xml version="1.0" encoding="utf-8" ?>'+message.data), 'text/xml');
    	/* testStart add off*/
    	// alert(typeof soaXmlDom);
    	/* testEnd */

    	/* fortest add off*/
    		// var x = queryXmlDomByCondition(soaXmlDom,config.blockMapList[0].xmlConditions);
    		// console.log(x);
    	/* fortest end */
    	if(soaCdt_pageHtml_map!==null){
    		// TODO 下一步处理
    		/* fortest add on*/
    		console.log("next");
    		/* fortest end */
    		afterGetPageData()
    	}

    }
    if(message.meta === 'getBlockMapList') {
        chrome.tabs.query({
            url: config.targetUrl
        }, function(tabs) {
            for (i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, {meta:'blockMapList',data:config.blockMapList});
            }
        });
    }
    if(message.meta === 'domMapList'){
    	/* testStart add off*/
    	// alert('domMap数据提交成功'+JSON.stringify(message.data));
    	/* testEnd */

    	soaCdt_pageHtml_map = message.data
    	if(soaXmlDom!==null){
    		// TODO 下一步处理
    		/* fortest add on*/
    		console.log("next");
    		/* fortest end */
    		afterGetPageData()
    		
    	}
    }
});


/**
* 在获取soa页面和目标页面的数据之后执行的步骤
* @function afterGetPageData
*/
function afterGetPageData(){
	/* global soaXmlDom */
	/* global soaCdt_pageHtml_map */
	var domMaps = getDomMapList(soaXmlDom,soaCdt_pageHtml_map)
	/* fortest start add*/ 
	console.log(domMaps)
	/* fortest end */
	testAllProducts(domMaps);
}



/**
* 测试映射中的数据
* @function testAllProducts
* @param {Object} domMaps soa页面和target页面的数据的映射
*/
function testAllProducts(domMaps){
	for(var key in domMaps){
		var domMap = domMaps[key];
		testBlock(blockMap);
	}
}

/**
* 测试一个block里面的产品
* @function testBlock
* @param {Object} blockMap 一个区块的产品在soa和target页面上的映射
*/
function testBlock(blockMap){
	var soaProInfos = blockMap.soaProInfos;
	var targetProInfos = blockMap.targetProInfos;
	if(soaProInfos.length === targetProInfos.length){
		for(var index in soaProInfos){
			testProduct(soaProInfos[index], targetProInfos[index]);
		}
	}else{
		var log = createLogItem('产品测试','产品模块：'+blockMap.description+' 错误描述：产品数量不符合'+' soa产品数量：'+soaProInfos.length+' 实际产品数量:'+targetProInfos.length);
		logs.push(log);
		errLogs.push(log);
	}
}

/**
* 测试一个产品中的数据 
* @function testProduct
* @param {Object} soaProInfo soa页面中的产品信息
* @param {Object} targetProInfo 目标页面中的产品信息
*/
function testProduct(soaProInfo, targetProInfo){
	var txt = targetProInfo.innerText;
	for(key in config.productMap.fieldList){
		var field = fieldList[key];
		var soaField = soaProInfo.getElementsByTagName(field.xmlTagName)[0].firstChild.nodeValue;
		var targetField = targetProInfo.querySelector(field.htmlQuery).innerText;
		testStr(soaField, targetField, '产品测试','产品文本：'+txt);
	}
}

/**
* 提供给其他插件页面
* @function setConfig
* @param {Object} _config 传入的配置对象
*/
function setConfig(_config) {
    /* global configText */
    configText = _config;
    /* global config */
    config = JSON.parse(configText);
}

/**
* 获取配置对象
* @function getConfig
* @returns {Object} 配置对象
*/
function getConfig() {
    /* global configText */
    return configText;
}

/**
* 给日志对象添加一条日志
* @function addLog
* @param {String} log 一条日志
*/
function addLog(log) {
    /* global logs */
    logs += ('\n' + log);
}

/**
* 给日志对象添加一条错误日志
* @function addErrLog
* @param {String} errLog 一条错误日志
*/
function addErrLog(errLog) {
    /* global errLogs */
    errLogs += ('\n' + errLog);
}

/**
* 获取日志文本
* @function getLogs
* @returns {String} 日志文本
*/
function getLogs() {
    /* global logs */
    return logs;
}

/**
* 获取错误日志文本
* @function getErrLogs
* @returns {String} 错误日志文本
*/
function getErrLogs() {
    /* global errLogs */
    return errLogs;
}

/**
* 开始测试测试，打开各种页面
* @function startTest
*/
function startTest() {
	init();
    chrome.tabs.create({
        url: config.targetUrl
    }, function(tab) {})
    chrome.tabs.create({
        url: 'http://61.155.159.91:8208/InterVacation/Query/Debug.aspx'
    }, function(tab) {})
    chrome.tabs.create({
        url: './source/result.html'
    }, function(tab) {})
}

/**
* 初始化数据
* @function init
*/
function init(){
	logs = [];
	errLogs = [];
	soaCdt_pageHtml_map = null;
	soaXmlDom = null;
}

/**
* 根据当前的映射关系，得出soa页面中产品信息和目标页面中产品信息映射
* @function getDomMapList
* @param {Object} soaXmlDom 来自soa接口的xml数据
* @param {Object} middleMapList 当前的pageHTML和soa条件的映射
* @return {Object} soaXmlDom和pageHTMLDOM的区块映射
*/
function getDomMapList(soaXmlDom, middleMapList){
	var domMapList = [];
	for(var key in middleMapList){
		middleMap = middleMapList[key];
		var domMap = {};
		var block = document.createElement('div');
		block.innerHTML = middleMap.htmlText;
		domMap.soaProInfos = queryXmlDomByCondition(soaXmlDom,middleMap.xmlConditions);
		domMap.targetProInfos = extractProduct(block);
		domMapList.push(domMap);
	}
	return domMapList;
}

/**
* 根据条件在xmlDOM中检索产品DOM对象
* @function queryXmlDomByCondition
* @param {Object} xmlDom 待检索的xmlDom对象
* @param {Object} conditions 查询条件
* @returns {Array} 符合条件的产品信息xml
*/
function queryXmlDomByCondition(xmlDom, conditions){
	var proInfoList = xmlDom.getElementsByTagName('ActivityProductInfo');
	var result = [];
	for(var index in proInfoList){
		var pass0 = true;
		var proInfo = proInfoList[index];
		if(typeof proInfo === 'number') break;
		for(var ind in conditions){
			var condition = conditions[ind];
			var realValue = proInfo.getElementsByTagName(condition.xmlTagName)[0].firstChild.nodeValue;
			var criterion = condition.xmlTagValue;
			var pass = false;
			if(criterion instanceof RegExp){
				// 假如为正则表达式
				pass = criterion.test(realValue);
			}else{
				// 否则为字符串
				pass = (criterion === realValue);
			}
			if(!pass){
				pass0 = false;
				break;
			}	
		}
		if(pass0){
			result.push(proInfo);
		}
	}
	return result;
}

/**
* 将一个DOM区块中的产品DOM提取出来放在一个数组中
* @function extractProduct
* @param {Object} dom 区块的dom元素
* @returns {Array} 区块中的产品列表
*/
function extractProduct(dom){
	/* global config */
	console.log(config.productMap.query);
	var proInfoList = dom.querySelectorAll(config.productMap.query);
	return [].slice.call(proInfoList);
}

/**
* 测试一个字符串，也就是最小的可检测单位
* @function testStr
* @param {String|RegEx} criterion 检测标准
* @param {String} target 检测目标
* @param {String} testPoint 测试点
* @param {String} description 描述
* @param {Object} logItem 日志条目 可选，如果传入了日志条目，测试的结果将添加到改日志条目之上 
*/
function testStr(criterion, target, testPoint, description, logItem){
	if(typeof criterion === 'string'){
		var result = (criterion === target);
	}else{
		var result = (criterion.test(target));
	}
	if(!!logItem){
		logItem.result = logItem.reslult&&result;
		!result && (logItem.description += (';error:'+description));
	}else{
		var logItem = createLogItem(testPoint,description,result);
		/* global logs */
		logs.push(logItem);
	}
	if(result === false){
		var errorLogItem = createLogItem(testPoint,description,result);
		/* global errLogs */
		errLogs.push(errorLogItem);
	}
}

/**
* 创建一个log条目
* @function createLogItem
* @param {String} testPoint 测试点
* @param {String} description	描述
* @param {Boolean} testResult 测试结果
* @returns {Object} 返回一个日志条目
*/
function createLogItem(testPoint, description, testResult){
	var logItem = {}
	logItem.date = new Date();
	/* global pageUrl */
	logItem.url = pageUrl;
	logItem.testPoint = testPoint;
	logItem.description = description;
	logItem.testResult = testResult;
	return logItem;
}