"use strict";

if (!window.kniffel) {
	var kniffel = {};
}

kniffel.Entry = function (id) {
	var value = null,
	locked = false;
	
	this.element = $(id).getElementsByTagName("span")[0];
	
	this.getValue = function () {
		return value || 0;
	};
	
	this.locked = function () {
		return locked;
	};
	
	this.enter = function (x) {
		if (!locked) {
			this.value = x;
			locked = true;
			this.element.innerHTML = util.leadZero(x);
			return true;
		}
		return false;
	};
	
	this.reset = function () {
		this.value = null;
		this.element.innerHTML = "  ";
		locked = false;
		return true;
	};
};

kniffel.sEntry = function (id) {
	var value = 0;
	this.element = $(id);
	this.set = function (x) {
		value = x;
		this.element.innerHTML = util.leadZero(x);
	};
	this.getValue = function () {
		return window.parseInt(value);
	};
	this.reset = function () {
		value = 0;
		this.element.innerHTML = "&nbsp;&nbsp;";
	};
};

kniffel.Sum = function (id) {
	var value = [];
	
	this.element = $(id).getElementsByTagName("span")[0];
	
	this.add = function (x) {
		value.push(x);
		this.element.innerHTML = util.leadZero(this.getValue());
	};
	
	this.undo = function () {
		var x = value.pop();
		this.element.innerHTML = util.leadZero(this.getValue());
	};
	
	this.getValue = function () {
		var i, l = value.length,
		s = 0;
		for (i=0; i<l; i+=1) {
			s += value[i];
		}
		return s;
	};
	
	this.reset = function () {
		value = [];
		this.element.innerHTML = "  ";
	};
};

kniffel.Bonus = function (id) {
	var $this = this,
	value = 0,
	stack = [],
	given = false,
	getvalue = function () {
		var i, l = stack.length,
		x = 0;
		for (i=0; i<l; i+=1) {
			x += stack[i];
		}
		return x;
	},
	calc = function () {
		var x = getvalue();
		if (x >= 63 && !given) {
			value = 35;
			$this.element.innerHTML = value;
			given = true;
			return true;
		}
		return false;
	};
	
	this.element = $(id).getElementsByTagName("span")[0];
	
	this.add = function (x) {
		stack.push(x);
		return calc();
	};
	
	this.undo = function () {
		stack.pop();
		return calc();
	};
		
	this.given = function () {
		return given;
	};
	
	this.getValue = function () {
		return value;
	};
	
	this.reset = function () {
		given = false;
		value = 0;
		stack = [];
		x = 0;
		this.element.innerHTML = "  ";
	};
};

kniffel.Togo = function (id) {
	var value = 3;
	
	this.element = $(id).getElementsByTagName("span")[0];
	
	this.decrement = function () {
		if (value > 0) {
			value -= 1;
			this.element.innerHTML = value+"";
			return true;
		}
		else {
			return false;
		}
	};
	
	this.reset = function () {
		value = 3;
		this.element.innerHTML = value+"";
		return true;
	};
	
	this.zero = function () {
		value = 0;
		this.element.innerHTML = "0";
		return true;
	};
};
			
	
/*
kniffel.Entry.prototype = kniffel.Sum.prototype = kniffel.Bonus.prototype = kniffel.Togo.prototype = {
	toString : function () {
		return util.leadZero(this.getValue());
	}
}
*/
