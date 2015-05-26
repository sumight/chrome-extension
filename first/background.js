// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
 //    console.log('Turning ' + tab.url + ' red!');
 //    chrome.tabs.executeScript({
 //        code: 'document.body.style.backgroundColor="red"'
 //    });

 //    var xhr = new XMLHttpRequest();
	// xhr.onreadystatechange = function(data) {
	//     if (xhr.readyState == 4) {
	//         if (xhr.status == 200) {
	//             var data = (xhr.responseText);
	//             callback(data);
	//         } else {
	//             callback(null);
	//         }
	//     }
	// }
 //    xhr.open('GET', 'http://open.chrome.360.cn/extension_dev/xhr.html');
	// xhr.send();
	// function callback(data){
	// 	console.log('data',data)
	// 	// alert(data)
	// 	chrome.tabs.executeScript({
	//         code: "console.log('"+data+"'')"
	//     });
	// }
// 	chrome.tabs.create({url:'http://baidu.com'},function(){})
// 	var views = chrome.extension.getViews();
// 	alert(views[0].location.href)
// });
function clickIt(){
	alert('clickIt');
}
function getData(){
	return 'from background page'
}




