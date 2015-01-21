"use strict";

if (!window.kniffel) {
	var kniffel = {};
}

kniffel.prompt = (function (kniffel, global) {
	var $public = {},
	$private = {};
	
	$private.init = function () {
		$private.elem = $("prompt");
	};
	
	$private.blink = function (txt, t, n) {
		if (!$private.blink.prompting) {
			$private.blink.prompting = true;
			$private.blink.txt = util.string.trim(txt);
			$private.blink.interval = new util.Interval($private.blink.blink, t || 500);
			$private.blink.interval.start(n || 8, $private.blink.clear);
		}
		else {
			$private.blink.clear();
			$private.blink(txt);
		}
		return true;
	};
	$private.blink.blink = function () {
		var prompt = $private.blink;
		if (prompt.visible) {
			$private.elem.innerHTML = "";
			prompt.visible = false;
		}
		else {
			$private.elem.innerHTML = prompt.txt;
			prompt.visible = true;
		}
		return true;
	};
	$private.blink.clear = function () {
		$private.blink.interval.stop();
		$private.blink.interval = null;
		$private.elem.innerHTML = "";
		$private.blink.visible = false;
		$private.blink.txt = "";
		$private.blink.prompting = false;
	};
	$private.blink.txt = "";
	$private.blink.visible = false;
	$private.blink.prompting = false;
	
	$private.show = function (txt, t) {
		if (!$private.show.prompting) {
			$private.show.prompting = true;
			$private.elem.innerHTML = util.string.trim(txt);
			$private.show.timeout = global.setTimeout($private.show.clear, t || 3000);
		}
		else {
			global.clearTimeout($private.show.timeout);
			$private.show.clear();
			$private.show(txt);
		}
		return true;
	};
	$private.show.clear = function () {
		$private.elem.innerHTML = "&nbsp;&nbsp;";
		$private.show.prompting = false;
	};
	$private.show.timeout = 0;
	$private.show.prompting = false;
	
	// a bridge to $private.blink()
	$public.blink = function (txt) {
		$private.blink(txt);
		return true;
	};
	
	// a bridge to $private.show()
	$public.show = function (txt, t) {
		$private.show(txt, t);
		return true;
	};
	
	util.event.add(window, "load", $private.init);
	
	return $public;
}(kniffel, window));
