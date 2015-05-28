var bg = chrome.extension.getBackgroundPage();
$('#J_error-logs').html(bg.getErrLogs());
$('#J_logs').html(bg.getLogs());