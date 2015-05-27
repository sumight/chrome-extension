var config = null;
var logs = null;
var errLogs = null;

//==================test data=======
config = {
        targetUrl: 'http://www.ly.com/zhuanti/shuqi_jiadao/',
        pageMeta:{

        },
        activity: {
            pageIndex: '1',
            pageSize: '100',
            activityId: '1194',
            periodId: '1837',
            pageId: ''
        },
        productMap:{
        	htmlQuery:'',
        	fieldList:[
        		{
        			htmlQuery:'',
        			xmlTagName:''
        		}
        	]
        },
        blockMapList:[
        	{
        		xmlCondition:{
        			xmlTagName:'',
        			xmlTagValue:''
        		},
        		pageCondition:{
	        		triggerQuery:"",
	        		pageRangeQuery:''
        		}
        	}
        ]
    }
    //===============================

/**
* 提供给其他插件页面
* @function setConfig
* @param {Object} _config 传入的配置对象
*/
function setConfig(_config) {
    /* global config */
    config = _config;
}

/**
* 获取配置对象
* @function getConfig
* @returns {Object} 配置对象
*/
function getConfig() {
    /* global config */
    return config;
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
    chrome.tabs.create({
        url: config.targetUrl
    }, function(tab) {})
    //在正式环境下取出注释
    // chrome.tabs.create({
    //     url: 'http://61.155.159.91:8208/InterVacation/Query/Debug.aspx'
    // }, function(tab) {})
    // chrome.tabs.create({
    //     url: './source/result.html'
    // }, function(tab) {})
}

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
    	alert('SOA数据提交成功'+message.data);
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
});
