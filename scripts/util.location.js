util.Location = function (str) {
	
	var obj = {}, match,
		endOfProtocol,
		endOfHostname;
	
	if (match = /^(mailto|javascript):(.*)$/.exec(str)) {
		
		this.type = match[1];
		
		this.content = match[2];
		
		}
	
	else {
	
		this.href = str;
	
		if ((endOfProtocol = str.indexOf("://")) >= 0) {
			
			this.protocol = str.substring(0, endOfProtocol);
		
			str = str.replace("://", "");
		
			};
	
		if (match = /\:\d+/.exec(str)) {
		
			endOfHostname = str.indexOf(match[0]);
		
			this.hostname = str.substring(endOfProtocol, endOfHostname);
		
			this.port = str.substring(endOfHostname+1, endOfHostname = endOfHostname+match[0].length);
		
			str.replace(match[0], "");
		
			}
	
		else {
		
			endOfHostname = str.indexOf("/");
		
			this.hostname = str.substring(endOfProtocol, endOfHostname);
		
			this.port = "";
		
			};
		
		if (/\?/.test(str)) {
		
			endOfPath = str.indexOf("?");
		
			if (/\#/.test(str)) {
			
				endOfSearch = str.indexOf("#");
			
				this.pathname = str.substring(endOfHostname, endOfPath);
			
				this.search = str.substring(endOfPath, endOfSearch);
			
				this.hash = str.substring(endOfSearch, str.length);
			
				}
		
			else {
			
				this.pathname = str.substring(endOfHostname, endOfPath);
		
				this.search = str.substring(endOfPath, str.length);
			
				this.hash = "";
			
				};
		
			}
	
		else if (/\#/.test(str)) {
		
			endOfPath = str.indexOf("#");
		
			this.pathname = str.substring(endOfHostname, endOfPath);
		
			this.search = "";
		
			this.hash = str.substring(endOfPath, str.length);
		
			}
	
		else {
		
			this.pathname = str.substring(endOfHostname, str.length);
		
			this.search = "";
		
			this.hash = "";
			}
		};
};

util.Location.prototype = { 
	
	"goto" : function () {
	
		location.href = this.href;
	
		},
		
	modifiePathname : function (newValue) {
	
		this.pathname = newValue;
	
		this.href = this.protocol+"://"+this.hostname+":"+this.port+this.pathname+this.search;
	
		return this.href;
	
		},

	modifieSearch : function (key, value, replace) {
	
		this.search = (!this.search || replace) ?"?"+key+"="+value :this.search+"&"+key+"="+value;
	
		this.href = this.protocol+"://"+this.hostname+((this.port) ?":"+this.port :"")+this.pathname+this.search;
	
		return this.href;
		
		}

};
