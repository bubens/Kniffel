//AJAX-Handling
util.ajax = (function () {
	
	var ajax = {},
		
	getRequest = function () {
		return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
	};
		
	ajax.setRequest = function (type, url, orsc, headers) {
		var request = getRequest(),	
			p, q;
		request.open(type, url, true);
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		
		if (headers && headers.type == "object") {
			for (q in headers) {
				if (headers.hasOwnProperty(q)) {
					request.setRequestHeader(q, headers[q]);
				}
			}
		}
		
		if (orsc.type === "object") {
			request.onreadystatechange = function () {
				if (request.status === 4) {
					for (p in orsc) {
						if (orsc.hasOwnProperty(p) && request.readyState === parseInt(p)) {
							orsc[p](request);
						}
					}
				}
			}
		}
		else {
			request.onreadystatechange = function () {
				if (request.readyState === 4) { //&& request.status === 200) {
					orsc(request);
				}
			}
		}
		
		return request;
	};
		
	ajax.get = function (url, params, orsc, headers) {
		var request = ajax.setRequest("get", url, orsc);
		request.send(params);
		return true;
	};
		
	ajax.post = function (url, params, orsc, headers) {
		var request = ajax.setRequest("post", url, orsc, {"Content-Type": "application/x-www-form-urlencoded"});
		request.send(params);
	};
	
	ajax.version = "0.2.0";
	
	return ajax;
}());
