var changeEvent = document.createEvent("HTMLEvents");
changeEvent.initEvent('change',false,true);
// for test


// ============================


if(document.readyState === 'complete'){
	var namespace = document.querySelector("#ddlNameSpace [selected=selected]") && document.querySelector("#ddlNameSpace [selected=selected]").innerText
	var method = document.querySelector("#ddlMethods [selected=selected]") && document.querySelector("#ddlMethods [selected=selected]").innerText
	if(namespace==='ProductQueryContext'&& method!=='[Version=1] QueryActivityProductList'){
		// 在选择了命名空间而没有选择方法的情况下选择方法
		selectMethod()
	}else if(namespace==='ProductQueryContext' && method==='[Version=1] QueryActivityProductList'){
		// 在选择了命名空间和方法的情况下填写
		console.log(document.readyState === 'complete')
		fillAndCommit();
	}else if(document.getElementsByClassName('pretty-print').length > 0){
		// 在数据呈现页面下
		collectionData()
	}else{
		// 在命名空间没有选择的情况下选择命名空间
		selectNameSpace()
	}	
}


function selectNameSpace(){
	console.log('selectNameSpace');
	var namespaceSelect = document.querySelector("#ddlNameSpace");
	namespaceSelect.value = 'ProductQueryContext';
	namespaceSelect.dispatchEvent(changeEvent);
}

function selectMethod(){
	console.log('selectMethod');
	var methodSelect = document.querySelector("#ddlMethods");
	methodSelect.value = 'QueryActivityProductList@QueryActivityProductList@1';
	methodSelect.dispatchEvent(changeEvent);
}

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

function collectionData(){
	// console.log(document.getElementsByClassName('pretty-print')[0].innerText);
	chrome.runtime.sendMessage(null,{meta:'soaData',data:document.getElementsByClassName('pretty-print')[0].innerText})
}