"use strict";

if (!window.util) {
	var util = {};
}

util = {
	version : "0.0.0a",
	author : "bubens van lyka"
};

Array.convert = function (a) {
	return Array.prototype.slice.apply(a);
};

Function.bounce = function (x) {
	return x;
};

Function.prototype.curry = function () {
	var _this = this,
		args = Array.convert(arguments);
	return function () {
		return _this.apply(this, args);
	}
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
	return document.getElementById(id);
}

util.error = function (error) {
	var e = new Error();
	e.name = error.what;
	e.message = error.why+" (at "+error.where+")";
	throw e;
};

util.leadZero = function (x) {
	return (x > 9) ?""+x :"0"+x;
}

util.string = {
	trim : function (str) {
		str = str.replace(/^\s+/, "").replace(/\s+$/, "");
		return str;
	}
}
