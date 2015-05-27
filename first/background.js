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

//提供给其他插件页面
function setConfig(_config) {
    config = _config;
}

function getConfig(_config) {
    return config;
}

function addLog(log) {
    logs += ('\n' + log);
}

function addErrLog(errLog) {
    errLogs += ('\n' + errLog);
}

function getLogs() {
    return logs;
}

function getErrLogs() {
    return errLogs;
}

function startTest() {
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

// 提供给页面脚本
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
