/* jshint strict:true */


//EVENT-Handling
util.event = (function () {
	"use strict";
	return {
		guid: 1,

		//dean edwards addEvent solution (slightly modified)
		//for details see http://dean.edwards.name/weblog/2005/10/add-event/	
		add: function (element, type, handler) {
			var handlers;
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			}
			else {
				if (!handler.$$guid) {
					handler.$$guid = addEvent.guid++;
				}
				if (!element.events) {
					element.events = {};
				}
				handlers = element.events[type];
				if (!handlers) {
					handlers = element.events[type] = {};
					if (element["on" + type]) {
						handlers[0] = element["on" + type];
					}
				}
				handlers[handler.$$guid] = handler;
				element["on" + type] = util.event.handle;
			}
		},
		remove: function (element, type, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			}
			else {
				if (element.events && element.events[type]) {
					delete element.events[type][handler.$$guid];
				}
			}
		},
		handle: function (event) {
			var returnValue = true;
			event = event || util.event.fix(((this.ownerDocument || this.document || this).parentWindow || window).event);
			var handlers = this.events[event.type];
			for (var i in handlers) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false) {
					returnValue = false;
				}
			}
			return returnValue;
		},
		fix: function (event) {
			event.preventDefault = util.event.preventDefault;
			event.stopPropagation = util.event.stopPropagation;
			return event;
		},
		preventDefault: function () {
			this.returnValue = false;
		},
		stopPropagation: function () {
			this.cancelBubble = true;
		}
	};
}());


