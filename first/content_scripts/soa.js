var changeEvent = document.createEvent("HTMLEvents");
changeEvent.initEvent('change',false,true);

if(document.readyState === 'complete'){
	var namespace = document.querySelector("#ddlNameSpace [selected=selected]") && document.querySelector("#ddlNameSpace [selected=selected]").innerText
	var method = document.querySelector("#ddlMethods [selected=selected]") && document.querySelector("#ddlMethods [selected=selected]").innerText
	if(namespace==='ProductQueryContext'&& method!=='[Version=1] QueryActivityProductList'){
		// 在选择了命名空间而没有选择方法的情况下选择方法
		selectMethod()
	}else if(namespace==='ProductQueryContext' && method==='[Version=1] QueryActivityProductList'){
		// 在选择了命名空间和方法的情况下填写
		fillAndCommit();
	}else if(document.getElementsByClassName('pretty-print').length > 0){
		// 在数据呈现页面下
		collectionData();
	}else{
		// 在命名空间没有选择的情况下选择命名空间
		selectNameSpace();
	}
}

/**
* 选择SOA命名空间
* @function selectNameSpace
*/
function selectNameSpace(){
	console.log('selectNameSpace');
	var namespaceSelect = document.querySelector("#ddlNameSpace");
	namespaceSelect.value = 'ProductQueryContext';
	/* global changeEvent */
	namespaceSelect.dispatchEvent(changeEvent);
}

/**
* 选择SOA方法
* @function selectMethod
*/
function selectMethod(){
	console.log('selectMethod');
	var methodSelect = document.querySelector("#ddlMethods");
	methodSelect.value = 'QueryActivityProductList@QueryActivityProductList@1';
	/* global changeEvent */
	methodSelect.dispatchEvent(changeEvent);
}

/**
* 根据配置文件填写表单
* @function fillAndCommit
*/
function fillAndCommit(){
	console.log('fillAndCommit');
	chrome.runtime.sendMessage(null,{meta:'getActiveConfig'});
	chrome.runtime.onMessage.addListener(function(message) {
		if(message.meta === 'activeConfig'){
			var activeConfig = message.data;
			console.log(activeConfig);
			document.getElementById('PageIndex').value = activeConfig.pageIndex;
			document.getElementById('PageSize').value = activeConfig.pageSize;
			document.getElementById('ActivityList').value = activeConfig.activityId;
			document.getElementById('PeriodID').value = activeConfig.periodId;
			document.getElementById('PageId').value = activeConfig.pageId;
			document.getElementById('btnSubmit').click();
		}
	});
}

/**
* 收集页面的xml文本发送给background
* @function collectionData
*/
function collectionData(){
	// console.log(document.getElementsByClassName('pretty-print')[0].innerText);
	chrome.runtime.sendMessage(null,{meta:'soaData',data:document.getElementsByClassName('pretty-print')[0].innerText})
}