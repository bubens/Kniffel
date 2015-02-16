/* jshint strict:true */

var util = {
	version : "0.0.0a",
	author : "bubens van lyka"
};

Array.convert = function (a) {
	"use strict";
	return Array.prototype.slice.apply(a);
};

Function.bounce = function (x) {
	"use strict";
	return x;
};

Function.prototype.curry = function () {
	"use strict";
	var _this = this,
		args = Array.convert(arguments);
	return function () {
		return _this.apply(this, args);
	};
};

Function.yes = Function.bounce.curry(true);
Function.no = Function.bounce.curry(false);

Function.prototype.type = "function";
Object.prototype.type = "object";
Array.prototype.type = "array";
String.prototype.type = "string";
Number.prototype.type = "number";
Date.prototype.type = "date";

function $(id) {
	"use strict";
	return document.getElementById(id);
}

util.error = function (error) {
	"use strict";
	var e = new Error();
	e.name = error.what;
	e.message = error.why+" (at "+error.where+")";
	throw e;
};

util.leadZero = function (x) {
	"use strict";
	return (x > 9) ? "" + x : "0" + x;
};

util.string = {
	trim : function (str) {
		"use strict";
		str = str.replace(/^\s+/, "").replace(/\s+$/, "");
		return str;
	}
};
