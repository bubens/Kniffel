/* jshint strict:true */


//an extended Interval constructor
util.Interval = function (fn, fr) {
	"use strict";
	
	var _this = this,
		to = null,
		iter = null,
		callback = null,
		active = false,
		
		freq = function (t) {
			var a = _this.frequence-(new Date().getTime() - t);
			return (a >= 0) ?a :0;
		},
		
		exec = function () {
			var t = new Date().getTime();
			if (active) {
				if (iter === null || iter > 0) {
					_this.fn();
					to = window.setTimeout(exec, freq(t));
					iter = (iter !== null) ?iter-1 :null;
				}
				else {
					_this.stop();
					if (callback) {
						callback();
					}
				}
			}
			else {
				return null;
			}
		};
					
	this.fn = (fn.type === "function") ?fn :util.error({what: "wrong type", where:"util.Interval", why:"fn must be function: "+fn});
	
	this.frequence = (!window.isNaN(fr)) ?window.parseInt(fr) :util.error({what: "wrong type", where:"util.Interval", why:"fr must be number: "+fr});
	
	this.start = function (n, cb) {
		
		if (n) {
			iter = (!window.isNaN(n)) ?window.parseInt(n) :util.error({what: "wrong type", where: "util.Interval->start", why: "n must be number: "+n});
			
			if (cb) {
				callback = (cb.type === "function") ?cb :util.error({what: "wrong type", where: "util.Interval->start", why: "callback must be function: "+callback});
			}
		}
		
		active = true;
		exec();
		
		return _this;
	};
	
	this.stop = function () {
		window.clearTimeout(to);
		active = false;
		iter = null;
		
		return _this;
	};
};
