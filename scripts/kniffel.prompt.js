/* jshint strict:true */
/* global util */

kniffel.prompt = (function (kniffel, util, window) {
	"use strict";
	var element = $("prompt"),
		prompting = false,
		visible = false,
		text = "",
		interval, timeout;

	function startBlinking(txt, t, n) {
		if (!prompting) {
			prompting = true;
			text = util.string.trim(txt);
			interval = new util.Interval(blink, t || 500);
			interval.start(n || 8, stopBlinking);
		}
		else {
			stopBlinking();
			startBlinking(txt, t, n);
		}
		return true;
	}

	function stopBlinking() {
		if (interval) {
			interval.stop();
			interval = null;
			element.innerHTML = "";
			visible = false;
			prompting = false;
			text = "";
		}
	}

	function blink() {
		element.innerHTML = visible ? text : "";
		visible = !visible;
	}

	function showText(txt, t) {
		if (!prompting) {
			prompting = true;
			element.innerHTML = util.string.trim(txt);
			timeout = window.setTimeout(hideText, t || 3 * 1000);
		}
		else {
			window.clearTimeout(timeout);
			stopBlinking();
			hideText();
			showText();
		}
		return true;
	}

	function hideText() {
		element.innerHTML = "&nbsp;&nbsp;";
		window.clearTimeout(timeout);
		prompting = false;
	}

	return {
		blink: function (txt, t, n) {
			startBlinking(txt, t, n);
		},
		show: function (txt, t) {
			showText(txt, t);
		}
	};
}(kniffel, util, window));
