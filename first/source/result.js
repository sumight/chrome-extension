var bg = chrome.extension.getBackgroundPage();
$('#J_error-logs').text(bg.getErrLogs());
$('#J_logs').text(bg.getLogs());