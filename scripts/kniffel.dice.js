/* jshint strict:true */
/* global util */


kniffel.Dice = function (edge, id, className, parentId) {
	"use strict";
	var value = 0,
		held = false,
		parent = $(parentId),

		// with a little inspiration from http://code.google.com/p/browser-canvas-support/
		cvselm, cvs, canVas = (function () {
			var b = false;
			try {
				b = !!document.createElement("canvas").getContext("2d");
			}
			catch (e) {
				b = !!document.createElement("canvas").getContext;
			}
			return b;
		})(),

		cir = 2 * Math.PI,
		rad = edge * 0.1,
		l = edge * 0.2,
		r = edge * 0.8,
		m = edge * 0.5,


		draw = function (n, hold) {
			cvs.clearRect(0, 0, edge, edge);
			cvs.beginPath();
			cvs.fillStyle = "rgb(256, 256, 256)";
			cvs.fillRect(0, 0, edge, edge);
			if (n === 0) {
				cvs.font = parseInt(2 * rad) + "px Arial";
				cvs.fillStyle = "rgb(0,0,0)";
				if (!!cvs.fillText) {
					cvs.fillText("r o l l ' e m", 0, edge);
				}
			}
			if ((n % 2) > 0) {
				cvs.moveTo(m, m);
				cvs.arc(m, m, rad, 0, cir, true);
			}
			if (n > 1) {
				cvs.moveTo(l, l);
				cvs.arc(l, l, rad, 0, cir, true);
				cvs.moveTo(r, r);
				cvs.arc(r, r, rad, 0, cir, true);
			}
			if (n > 3) {
				cvs.moveTo(r, l);
				cvs.arc(r, l, rad, 0, cir, true);
				cvs.moveTo(l, r);
				cvs.arc(l, r, rad, 0, cir, true);
			}
			if (n == 6) {
				cvs.moveTo(l, m);
				cvs.arc(l, m, rad, 0, cir, true);
				cvs.moveTo(r, m);
				cvs.arc(r, m, rad, 0, cir, true);
			}
			cvs.closePath();
			cvs.fillStyle = "rgb(0,0,0)";
			cvs.fill();
			if (hold && n > 0) {
				cvs.fillStyle = "rgba(250, 214, 164, .4)";
				cvs.fillRect(0, 0, edge, edge);
			}
		};

	this.reset = function () {
		held = false;
		value = 0;
		draw(0);
	};

	this.getValue = function (v) {
		return value;
	};

	this.isHeld = function () {
		return held;
	};

	this.roll = function () {
		if (!held) {
			value = Math.floor(Math.random() * 6) + 1;
			draw(value);
			return true;
		}
		else {
			return false;
		}
	};

	// only shows n, wont change value
	this.rollTo = function (n, h) {
		draw(n, h);
	};

	this.hold = function () {
		if (!held) {
			held = true;
			draw(value, true);
		}
		else {
			held = false;
			draw(value, false);
		}
	};

	if (canVas) {
		cvselm = util.element.create("canvas", "", { width: edge, height: edge, id: id, className: className });
		parent.appendChild(cvselm);

		cvs = cvselm.getContext("2d");
		cvs.fillStyle = "rgb(0,0,0)";
		cvs.shadowOffsetX = 3;
		cvs.shadowOffsetY = 3;
		cvs.shadowBlur = 2;
		cvs.shadowColor = "rgba(0, 0, 0, 0.5)";
	}
	else {
		throw new Error("Canvas support required");
	}

	draw(0);
};
