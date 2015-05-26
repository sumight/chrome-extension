console.log('this is from myscript');
console.log(123)

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(data) {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var data = (xhr.responseText);
            callback(data);
        } else {
            callback(null);
        }
    }
}
xhr.open('GET', 'http://test.ly.com:8080/commitLog');
xhr.send();
function callback(data){
	console.log('data',data)
}
