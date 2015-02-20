(function ($, window, undefined) {
	"use strict";
	var apiURL = "http://unpunk.de/kniffel/list/index.php",
	apiParams = {
		"get" : "all",
		"top" : "all",
		"best" : "f",
		"record" : "f",
		"format" : "json"
	},
	
	list = null,
	
	// Kontroll-Variablen für Film
	step = 0,
	current = 0,
	start = 0,
	stop = 0,
	duration = 0,
	
	sortList = function (item1, item2) {
		var date1 = item1["date"],
		date2 = item2["date"];
		
		return date1 - date2;
	},
	leadZero = function (x) {
		return x < 10 ? "0" + x : x + "";
	},
	fontsize = function (score) {
		return Math.floor(score / 10) + "px";
	},
	popupPosition = (function () {
		var positions = {};
		window.positions = positions;
		return function (item) {
			var x = positions[item.name],
			y = $(window).height() - Math.floor((item.points / 375) * $(window).height());
			if (!x) {
				x = Math.floor(($(window).width() - 100) * Math.random() + 50);
				positions[item.name] = x;
			}
			return {"x" : x, "y" : y};
		};
	}()),
	testList = function (list) {
		var i = 0,
		l = list.length,
		item,
		uid = "test" + new Date().getTime();
		html = "<ol id=\"" + uid + "\">";
		for (i = 0; i < l; i += 1) {
			item = list[i];
			html += "<li>" + item["name"] + " " + item["points"] + " " + item["date"] + "</li>";
		}
		$("body")
			.append(html + "</ol>")
			.find("#" + uid)
			.click(function () {
				$("#" + uid).remove();
			});
		return true;
	},
	handleData = function(json, status, req) {
		if (status == "success") {
			list = json.list.sort(sortList);
			init(list);
		}
		else {
			alert("Ein Fehler ist aufgetreten. Vielleicht gehts nach einem Reload.\n\nStatus: " + status);
		}
				
	},
	init = function (list) {
		start = list[0].date;
		stop = list[list.length - 1].date;
		duration = stop - start;
		step = duration / 12000;
		current = start;
		initTime();
		initSpeedControl();
		$("#time").click(function () {
			$(this).unbind();
			frame();
		});
	
	},
	initTime = function () {
		$("<div id=\"time\">&nbsp;</div>")
			.css({"position" : "absolute",
				"width" : "300px",
				"bottom" : 30,
				"left" : Math.floor($(window).width() / 2) - 150,
				"textAlign" : "center",
				"fontSize" : "18pt",
				"padding" : "20px 0 20px 0"
			})
			.text("PLAY!")
			.appendTo("body");
	},
	initSpeedControl = function () {
		$("body").append("<div class=\"speedcontrol\" id=\"slower\">\<\<</div> <div class=\"speedcontrol\" id=\"faster\">\>\></div>")
			.find(".speedcontrol")
			.css({
				"position" : "absolute",
				"bottom" : 30,
				"width" : "40px",
				"textAlign" : "center",
				"fontSize" : "18pt",
				"padding" : "20px 0px",
				"cursor" : "pointer"
				})
			.end()
			.find("#faster")
			.css("left", Math.floor($(window).width() / 2) + 170)
			.attr("title", "Speed It Up!")
			.bind("click", function () {step *= 2; return true;})
			.end()
			.find("#slower")
			.css("left", Math.floor($(window).width() / 2) - 210)
			.attr("title", "Slow It Down!")
			.bind("click", function () {step /= 2; return true})
	},
	updateTime = function () {
		var now = new Date(current * 1000),
		hour = leadZero(now.getHours()),
		minute = leadZero(now.getMinutes()),
		day = leadZero(now.getDate()),
		month = leadZero(now.getMonth() + 1),
		year = now.getFullYear();
		$("#time").text(hour + ":" + minute + " - " + day + "." + month + "." + year);
	},
	popup = function (item) {
		var position = popupPosition(item);
		$("<div class=\"popup\" id=\"" + item.gid + "\">" + item.name + "<br>" + item.points + "</div>")
		.css({display : "none",
			fontSize : fontsize(item.points),
			position : "absolute",
			top : position.y,
			textAlign : "center"
		})
		.appendTo("body")
		.css("left", position.x - $("#" + item.gid).outerWidth() / 2)
		.fadeIn(10, function () {
			$(this).fadeOut(item.points * 20, function () {
				$(this).remove();
			});
		})
	},			
	frame = function () {
		var item,
		x, y, fnt;
		updateTime();
		while (list [0] && list[0].date <= current) {
			item = list[0];
			popup(item);
			list.splice(0, 1);
		}
		current += step;
		if (list.length > 0) {
			window.setTimeout(frame, 10);
		}
		else {
			$("#time").text("Done! Click to Replay!")
				.css("cursor", "pointer")
				.bind("click", function () {
					$("body").empty();
					$.ajax({
						url: apiURL,
						dataType : "json",
						data : apiParams,
						success : handleData
						});
				})
		}
	};
	
	$(function () {
		$.ajax({
			url: apiURL,
			dataType : "json",
			data : apiParams,
			success : handleData
		});
		
	});
	
}(jQuery, this));
