/* jshint strict:true */


//DOM-Operations
util.element = (function () {
	"use strict";
	return {
		create : function (tag, value, probs, css) {
			var elem = document.createElement(tag),
				p,v;
		
			if (probs) {
				for (p in probs) {
					if (probs.hasOwnProperty(p)) {
						elem[p] = probs[p];
					}
				}
			}
			if (css) {
				for (p in css) {
					if (css.hasOwnProperty(p)) {
						elem.style[p] = css[p];
					}
				}
			}
			if (value) {
				if (value.nodeType) {
					if (value.nodeType === 1 || value.nodeType === 3) {
						elem.appendChild(value);
					}
					else {
						util.error({what: "useless parameter", why: "can't handle node-type", where:"util.element.create"});
					}
				}
				else {
					elem.innerHTML = value;
				}
			}
			return elem;
		},
		
		empty : function (elem) {
			var i,l;
			
			if (elem.nodeType) {
				while (elem.firstChild) {
					elem.removeChild(elem.firstChild);
				}
				return true;
			}
			
			else if (elem.type === "string") {
				util.element.empty($(elem));
			}
			
			else if (elem.type === "array") {
				for (i=0, l=elem.length; i<l; i++) {
					util.element.empty(elem[i]);
				}
			}
			
			else {
				return false;
			}
		},
		
		getByClassName : function (className, parent) {
		
			var p = parent || document,
			
				getThemAll = function (className, parent) {
					var elements = parent.all || parent.getElementsByTagName("*"),
				
						//incase more than one classnames are given
						clname = className.split(" "),
						i, l = elements.length,
						j, k = clname.length,
						e, c, t,
						tmp = [];
				
					//array of regexps for later use
					for (j=0; j<k; j+=1) {
						clname[j] = new RegExp("\\b"+clname[j]+"\\b");
					}
				
					for (i=0; i<l; i+=1) {
						e = elements[i];
						c = elm.className;
						//test only if className is available at all
						if (c) {
							//every given classname is matched or die
							t = true;
							for (j=0; j<k; j+=1) {
								t = t && clname[j].test(c);
							}
							if (t) {
								tmp.push(e);
							}
						}
					}
				return tmp;
				};
		
			if (p.getElementsByClassName) {
				//we always want to have real arrays (not livenodelists)
				return Array.convert(p.getElementsByClassName(className));
			}
		
			return getThemAll(className, p);
		},
		
		version : "0.0.0"
	};
}());
	
