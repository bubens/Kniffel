/* jshint strict:true */
/* global util */

kniffel.infos = {};
kniffel.infos.elem = null;

kniffel.infos.createBox = function (txt, x, y) {
	"use strict";
	var elem = util.element.create("div", txt, {className:"infoBox",id:"infoBox"},{left:(x+20)+"px",top:(y)+"px"});
	kniffel.infos.elem = elem;
	document.body.appendChild(elem);
};

kniffel.infos.removeBox = function () {
	"use strict";
	kniffel.infos.elem.parentNode.removeChild(kniffel.infos.elem);
};

kniffel.infos.aboutPrompt = function (e) {
	"use strict";
	var event = e || window.event,
	x = event.pageX || event.offsetX,
	y = event.pageY || event.offsetY,
	txt = "Meldungen des Spiels werden hier angezeigt.";
	kniffel.infos.createBox(txt, x, y);
};

kniffel.infos.aboutChallenge = function (e) {
	"use strict";
	var event = e || window.event,
	x = event.pageX || event.offsetX,
	y = event.pageY || event.offsetY,
	txt = "Ist ein Spiel beendet und wurde in die Bestenliste eingetragen wird hier der Link angezeigt mit dem andere herausgefordert werden können.";
	kniffel.infos.createBox(txt, x, y);
};

kniffel.infos.aboutHighscore = function (e) {
	"use strict";
	var event = e || window.event,
	x = event.pageX || event.offsetX,
	y = event.pageY || event.offsetY,
	txt = "Die zehn besten Einträge in die Bestenliste. Um gegen ein Spiel in der Bestenliste anzutreten einfach auf den Namen des Spielers klicken. Die Liste wird monatlich zurückgesetzt.";
	kniffel.infos.createBox(txt, x, y);
};

kniffel.infos.init = function () {
	"use strict";
	util.event.add($("infoPrompt"), "mouseover", kniffel.infos.aboutPrompt);
	util.event.add($("infoChallenge"), "mouseover", kniffel.infos.aboutChallenge);
	util.event.add($("infoHighscore"), "mouseover", kniffel.infos.aboutHighscore);
	util.event.add($("infoPrompt"), "mouseout", kniffel.infos.removeBox);
	util.event.add($("infoChallenge"), "mouseout", kniffel.infos.removeBox);
	util.event.add($("infoHighscore"), "mouseout", kniffel.infos.removeBox);
};

util.event.add(window, "load", kniffel.infos.init);

kniffel.loader = (function (kniffel, global) {
	"use strict";
	var $public = {},
	$private = {};
	
	$private.element = null;
	$public.show = function () {
		$private.element.style.display = "inline";
	};
	
	$public.hide = function () {
		$private.element.style.display = "none";
	};
	
	$private.init = function () {
		$private.element = $("loader");
	};
	
	util.event.add(window, "load", $private.init);
	
	return $public;
}(kniffel, window)); 
