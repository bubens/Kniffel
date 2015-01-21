//COOKIE Handling
util.keks = (function () {

	//gmtstring to delete cookies (=time to die)
	var ttd = "Thu, 01 Jan 1970 00:01:00 GMT",

		//help to parse ttl
		testTtl = /^(\d+)([smhdy])$/i,
	
		//objuectify cookie-string
		objectify = function (str) {
			str = str || document.cookie;
			if (str) {
				var ck = str.split(";"), 
					obj={},
					tmp, i;
				for (i=0;i<ck.length;i+=1) {
					tmp = ck[i].split("=");
					obj[unescape(tmp[0])] = unescape(tmp[1] || tmp[0]);
					}
				return obj;
				}
			else {
				return {};
				}
			},

		parseTtl = function (ttl) {
			var type = ttl.type || "error",
				res,
				now = +new Date;
		
			//ttl not a Date-Object
			if (type !== "date") {
		
				//type of ttl is number
				if (type === "number") {
					return new Date(now + (ttl*1000*60*60*24));
					}
				
				//type of ttl is string
				else if (type === "string") {
			
					//ttl is valid GMT-string
					if (!isNaN(+new Date(ttl))) {
						return new Date(ttl);
						}
			
					//ttl is string of numbers
					else if (!isNaN(ttl)) {
						return new Date(now + (window.parseInt(ttl, 10)*1000*60*60*24));
						}
			
			
					//ttl has x(s/m/h/d/y) format (e.g. "31d" = 31 days)
					else if (res = testTtl.exec(ttl)) {
						switch (res[2].toLowerCase()) {
							case "s" : 
								ttl = parseInt(res[1], 10)*1000;
								break;
							case "m" :
								ttl = parseInt(res[1], 10)*1000*60;
								break;
							case "h" :
								ttl = parseInt(res[1], 10)*1000*60*60;
								break;
							case "d" :
								ttl = parseInt(res[1], 10)*1000*60*60*24;
								break;
							case "y" :
								ttl = parseInt(res[1], 10)*1000*60*60*24*365;
								break;
							default:
								util.error("huh?: "+res[0]);
							}
						return new Date(now + ttl);
						}
			
					//ttl makes no sense
					else {
						util.error({what:"useless parameter", why:"can't handle ttl: "+ttl, where: "util.keks->parseTtl"});
						}
					}
		
				//ttl makes no sense
				else {
					util.error({what:"useless parameter", why:"can't handle ttl: "+ttl, where: "util.keks->parseTtl"});
					}
		
				}
				
			//return date as it is
			else {
				return ttl;
				}
			},

		cookie = objectify(),

		keks = function (key) {
			if (!key) {
				return keks.getAs();
				}
			else {
				if (keks.isSet(key)) {
					return keks.get(key);
					}
				else {
					return null;
					}
				}
			};

	keks.isSet = keks.isset = function (key) {
		return (key) ?(document.cookie.indexOf(key+"=") >= 0) :null;
		};

	keks.get = function (key) {
		return cookie[key] || null;
		};
	
	keks.set = keks.modifie = function (key, value, expiration, path, domain, secure) {
		var ext, str,
			p;
		//strings bekommen
		if (key && value && key.toLowerCase) {
			ext = "";
			ext += (expiration) ?";expires="+parseTtl(expiration).toGMTString() :"";
			ext += (path) ?";path="+path :"";
			ext += (domain) ?";domain="+domain :"";
			ext += (secure) ?";secure" :"";
			document.cookie = escape(key)+"="+escape(value)+ext;
			cookie = objectify();
			return true;
			}
		
		//objekt bekommen
		else if (typeof key === "object" && !key.toLowerCase) {
			str = "";
			for (p in key) {
				if (key.hasOwnProperty(p)) {
					if (p.toLowerCase() === "expires") {
						str += "expires="+parseTtl(key[p])+";";
						}
					else if (p.toLowerCase() === "secure") {
						str += (key[p]) ?"secure;" :"";
						}
					else {
						str += escape(p)+"="+escape(key[p])+";";
						}
					}
				}
			document.cookie = str;
			cookie = objectify();
			return true;
			}
	 
		else {
			return false;
			}
	};
	
	keks.remove = function (key) {
		var i;
		key = key.split(" ");
		for (i=0; i<key.length; i+=1) {
			keks.set(key[i],"dummy",ttd);
			}
		cookie = objectify();
		return true;
		};


	keks.getAs = keks.getas = function (t,seperator,connector,quotes) {
		var type = t||"empty",
			tmp,
			i;
		switch (type.toLowerCase()) {
			case ("array") :
				tmp = [];
				for (i in cookie) {
					if (cookie.hasOwnProperty(i)) {
						tmp.push([i, cookie[i]]);
						}
					}
				return tmp;
			
			case ("string") :
				tmp = this.getAs("array");
				for (i=0;i<tmp.length;i+=1) {
					if (quotes) {
						tmp[i][1] = (typeof quotes === "string") ?quotes+tmp[i][1]+quotes :"\""+tmp[i][1]+"\"";
							}
					tmp[i] = tmp[i].join(connector || "=");
					}
				return tmp.join(seperator || ";");
			
			case ("json") :
				return "{"+this.getAs("string",",",":",true)+"}";
				
			case ("object"):
			case ("empty"):
				return cookie;

			default:
				return null;
			
			}
		};
	
	keks.version = "0.2.0";
	
	if (navigator.cookieEnabled) {
		return keks;
		}
	else {
		return null;
		}
}());

