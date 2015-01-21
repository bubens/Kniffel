(function ($, window, undefined) {
	var stopWatch, list, listlength,
	result = $("#results"),
	rawData = null,
	dataByName = {},
	queue = [],
	sortByScore = function (item1, item2) {
		return item2.points - item1.points;
	},
	sortByDate = function (item1, item2) {
		return item2.date - item1.date;
	},
	sortByName = function (list) {
		var data = {},
		name, i, l, item;
		for (i = 0, l = list.length; i < l; i += 1) {
			item = list[i];
			name = item.name;
			if (data.hasOwnProperty(name)) {
				data[name].push(item.points);
			}
			else {
				data[name] = [item.points];
			}
			
		}
		return data;
	},
	getMonth = (function () {
		var data = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
		return function (i) {
			return data[i];
		};
	}()),
	leadZero = function (x) {
		return x > 9 ? "" + x : "0" + x;
	},
	beautifyDate = function (date) {
		var datum = new Date(date),
		str = "";
		str += leadZero(datum.getDate()) + "." +
			leadZero(datum.getMonth() + 1) + "." +
			leadZero(datum.getFullYear()) + " " +
			leadZero(datum.getHours()) + ":" +
			leadZero(datum.getMinutes()) + ":" +
			leadZero(datum.getSeconds());
		return str;
	},
		
	handleData = function (data, status, req) {
		alert(data);
		if (status == "success") {
			list = data.list;
			listlength = list.length;
			analyse();
		}
		return true;
	},
	analyse = function () {
		queue.push(players);
		queue.push(entries);
		queue.push(bestEntry);
		queue.push(worstEntry);
		queue.push(latestEntry);
		queue.push(oldestEntry);
		queue.push(mostEntries);
		queue.push(mostCumulative);
		queue.push(median);
		queue.push(bestMedian);
		queue.push(worstMedian);
		queue.push(mostActiveYear);
		queue.push(mostActiveMonth);
		queue.push(mostActiveDay);
		queue.push(leastActivePeriod);
		queue.push(monthGraph);
		queue.push(weekdayGraph);
		queue.push(hourGraph);
		stopWatch = new Date().getTime();
		//console.profile("Working Queue");
		workQueue();
		window.dataByName = dataByName;
		//window.list = list;
	
	
	},
	workQueue = function () {
		var fn;
		if (queue.length > 0) {
			fn = queue.shift();
			fn();
			fn = null;
			window.setTimeout(workQueue, 0);
		}
		else {
			//console.profileEnd("Working Queue");
			$("body").append($("<span>" + (new Date().getTime() - stopWatch) + "ms</span>").css({position:"absolute","bottom":"3px","left":"3px"}));
		}
		return true;
	},
	players = function () {
		var html = "<li id=\"players\"><b>Spieler/Nicks insgesamt:</b> ",
		nick = "", nicks = 0, db = {}, i;
		for (i = 0; i < listlength; i += 1) {
			nick = list[i].name;
			if (!db[nick]) {
				nicks += 1;
				db[nick] = true;
			}
		}
		result.append(html + nicks + "</li>");
		return true;
	},
	entries = function () {
		result.append("<li id=\"entries\"><b>Eingetragene Spiele insgesamt:</b> " + listlength + "</li>");
	},
	bestEntry = function () {
		var top = 0,
		i,
		html = "<li id=\"bestEntry\"><b>Bester Eintrag:</b> ";
		list.sort(sortByScore);
		top = list[0].points;
		html += top + " Punkte von ";
		for (i = 0; i < listlength && list[i].points === top; i += 1) {
			html += list[i].name + " (" + beautifyDate(list[i].date * 1000) + ") ";
		}
		html += "</li>";
		result.append(html);
		return true;	
	},
	worstEntry = function () {
		var bottom = 0, i,
		html = "<li id=\"worstEntry\"><b>Schlechtester Eintrag:</b> ";
		list = list.reverse();
		bottom = list[0].points;
		html += bottom + " Punkte von ";
		for (i = 0; i < listlength && list[i].points === bottom; i += 1) {
			html += list[i].name + " (" + beautifyDate(list[i].date * 1000) + ") ";
		}
		html += "</li>";
		result.append(html);
		return true;
	},
	latestEntry = function () {
		var html = "<li id=\"latestEntry\"><b>Neuester Eintrag:</b> ";
		list.sort(sortByDate);
		html += list[0].name + " (" + beautifyDate(list[0].date * 1000) + ")";
		result.append(html + "</li>");
		return true;
	},
	oldestEntry = function () {
		var html = "<li id=\"oldestEntry\"><b>Ältester Eintrag</b> ";
		list = list.reverse();
		html += list[0].name + " (" + beautifyDate(list[0].date * 1000) + ")";
		result.append(html + "</li>");
		return true;
	},
	mostEntries = function () {
		var html = "<li id=\"mostEntries\"><b>Die meisten Einträge:</b> ",
		name = "",
		entries = 0,
		prop;
		dataByName = sortByName(list);
		for (prop in dataByName) {
			if (dataByName.hasOwnProperty(prop)) {
				if (dataByName[prop].length > entries) {
					name = prop;
					entries = dataByName[prop].length;
				}
			}
		}
		html += name + " (" + entries + " Einträge)";
		result.append(html + "</li>");
		return true;
	},
	mostCumulative = function () {
		var html = "<li id=\"mostCumulative\"><b>Die meisten Punkte (kumuliert):</b> ",
		name = "",
		cumulative = 0,
		sum = 0,
		player, prop, i, l;
		for (prop in dataByName) {
			sum = 0;
			if (dataByName.hasOwnProperty(prop)) {
				player = dataByName[prop];
				for (i = 0, l = player.length; i < l; i += 1) {
					sum += player[i];
				}
				if (sum > cumulative) {
					name = prop;
					cumulative = sum;
				}
			}
		}
		html += name + " (" + cumulative + " Punkte gesamt)";
		result.append(html + "</li>");
		return true;
	},
	median = function () {
		var html = "<li id=\"median\"><b>Durchschnitt (insgesamt):</b> ",
		sum = 0,
		median, i;
		for (i = 0; i < listlength; i += 1) {
			sum += list[i].points;
		}
		median = Math.round((sum / listlength) * 100) / 100;
		result.append(html += median + " Punkte");
		return true;
	},
	bestMedian = function () {
		var html = "<li id=\"bestMedian\"><b>Bester Durchschnitt (bei mehr als einem Spiel):</b> ",
		name = "",
		median = .0,
		games = 0,
		tempmedian = .0,
		sum = 0,
		player, prop, i, l;
		for (prop in dataByName) {
			sum = 0;
			if (dataByName.hasOwnProperty(prop)) {
				if (dataByName[prop].length > 1) {
					player = dataByName[prop];
					for (i = 0, l = player.length; i < l; i += 1) {
						sum += player[i];
					}
					tempmedian = Math.round(sum/(player.length) * 100) / 100;
					if (tempmedian > median) {
						name = prop;
						median = tempmedian;
						games = player.length;
					}
				}
			}
		}
		//median = Math.round(median * 100) / 100;
		html += name + " (" + median + " Punkte in " + games + " Spielen)";
		result.append(html + "</li>");
		return true;
	},
	worstMedian = function () {
		var html = "<li id=\"worstMedian\"><b>Schlechtester Durchschnitt (bei mehr als einem Spiel):</b> ",
		name = "",
		median = 999999999.99,
		games = 0,
		tempmedian = .0,
		sum = 0,
		player, prop, i, l;
		for (prop in dataByName) {
			sum = 0;
			if (dataByName.hasOwnProperty(prop)) {
				if (dataByName[prop].length > 1) {
					player = dataByName[prop];
					for (i = 0, l = player.length; i < l; i += 1) {
						sum += player[i];
					}
					tempmedian = sum/(player.length);
					if (tempmedian < median) {
						name = prop;
						median = tempmedian;
						games = player.length;
					}
				}
			}
		}
		median = Math.round(median * 100) / 100;
		html += name + " (" + median + " Punkte in " + games + " Spielen)";
		result.append(html + "</li>");
		return true;
	},
	mostActiveDay = function () {
		var html = "<li id=\"mostActiveDay\"><b>Tag mit den meisten Einträgen:</b> ",
		id = "", item = {},
		db = {},
		entries = 0,
		date, d, m, y,
		i, prop;
		for (i = 0; i < listlength; i += 1) {
			item = list[i];
			date = new Date(item.date * 1000);
			id = "";
			id += "_" + date.getDate();
			id += "_" + date.getMonth();
			id += "_" + date.getYear();
			if (db.hasOwnProperty(id)) {
				db[id] += 1;
			}
			else {
				db[id] = 1;
			}
		}
		id = "";
		for (prop in db) {
			if (db.hasOwnProperty(prop)) {
				item = db[prop];
				if (item > entries) {
					id = prop;
					entries = item;
				}
			}
		}
		date = id.split("_");
		d = date[1];
		m = parseInt(date[2], 10) + 1;
		y = parseInt(date[3], 10) + 1900;
		html += d + "." + m + "." + y + " (" + entries + " Einträge)";
		result.append(html + "</li>");
		return true;	
	},
	mostActiveMonth = function () {
		var html = "<li id=\"mostActiveMonth\"><b>Monat mit den meisten Einträgen:</b> ",
		id = "", item = {},
		db = {},
		entries = 0,
		date, m, y, i, prop;
		for (i = 0; i < listlength; i += 1) {
			item = list[i];
			date = new Date(item.date * 1000);
			id = "";
			id += "_" + date.getMonth();
			id += "_" + date.getYear();
			if (db.hasOwnProperty(id)) {
				db[id] += 1;
			}
			else {
				db[id] = 1;
			}
		}
		id = "";
		for (prop in db) {
			if (db.hasOwnProperty(prop)) {
				item = db[prop];
				if (item > entries) {
					id = prop;
					entries = item;
				}
			}
		}
		date = id.split("_");
		m = getMonth(parseInt(date[1], 10));
		y = parseInt(date[2], 10) + 1900;
		html += m + " " + y + " (" + entries + " Einträge)";
		result.append(html + "</li>");
		return true;	
	},
	mostActiveYear = function () {
		var html = "<li id=\"mostActiveYear\"><b>Jahr mit den meisten Einträgen:</b> ",
		id = "", item = {},
		db = {},
		entries = 0,
		date, y, i, prop;
		for (i = 0; i < listlength; i += 1) {
			date = new Date(list[i].date * 1000);
			id = "$_" + date.getYear();
			if (db.hasOwnProperty(id)) {
				db[id] += 1;
			}
			else {
				db[id] = 1;
			}
		}
		id = "";
		for (prop in db) {
			if (db.hasOwnProperty(prop)) {
				item = db[prop];
				if (item > entries) {
					id = prop;
					entries = item;
				}
			}
		}
		date = id.split("_");
		y = parseInt(date[1], 10) + 1900;
		html += y + " (" + entries + " Einträge)";
		result.append(html + "</li>");
		return true;	
	},
	leastActivePeriod = function () {
		var html = "<li id=\"leastActivePeriod\"><b>Längster Zeitraum ohne Einräge:</b> ",
		byDate = list.sort(sortByDate).reverse(),
		date = 0, delta = 0, tmpdelta = 0,
		date1, date2, days,
		i;
		for (i = 1; i < listlength; i += 1) {
			tmpdelta = byDate[i].date - byDate[i - 1].date;
			if (tmpdelta > delta) {
				delta = tmpdelta;
				date = byDate[i - 1].date;
			}
		}
		date1 = new Date(date * 1000);
		date2 = new Date((date + delta) * 1000);
		days = Math.floor(delta / (60 * 60 * 24));
		hours = Math.floor((delta % (60 * 60 * 24)) / (60 * 60));
		minutes = Math.floor((delta % (60 * 60 * 24) % (60 * 60)) / 60);
		seconds = delta % (60 * 60 * 24) % (60 * 60) % 60;
		html += days + " Tage, ";
		html += hours + " Stunden, ";
		html += minutes + " Minuten und ";
		html += seconds + " Sekunden ";
		html += "(" + beautifyDate(date1) + " - " + beautifyDate(date2) + ")";
		result.append(html + "</li>");
		return true;
			
	
	},
	monthGraph = function () {
		var months = [0,0,0,0,0,0,0,0,0,0,0,0],
		abr = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
		max, date,
		cssBox = {
			position: "absolute",
			top : "10px",
			right : "10px",
			width : "240px",
			height : "200px",
			background : "#FAEBD7",
			border : "solid 2px #BC9F75",
			margin: "0",
			padding : "10px 10px 0px 10px",
			textAlign : "center",
			borderRadius : "10px"
		},
		cssBar = {
			width : "17px",
			height : "0px",
			position : "absolute",
			bottom : "0px",
			left : "10px",
			borderRadius : "0px",
			border: "1px #000 solid",
			background: "#BC9F75",
			overflow : "hidden"
		},			
		box = $("<div id=\"monthGraph\">Verteilung über Monate</div>").css(cssBox),
		bar, i;
		for (i = 0; i < listlength; i += 1) {
			date = new Date(list[i].date * 1000);
			months[date.getMonth()] += 1;
		}
		max = months.max();
		for (i = 0; i < 12; i += 1) {
			cssBar.height = Math.round((months[i] / max) * 180) + "px";
			cssBar.left = (i * 20) + 10 + "px";
			bar = $("<div id=\"monthGraphBar" + (i + 1) + "\">" + abr[i] + "<br>" + months[i] +  "</div>").css(cssBar);
			box.append(bar);
		}
		result.append(box);
		
	},
	weekdayGraph = function () {
		var wdays = [0, 0, 0, 0, 0, 0, 0],
		abr = ["S", "M", "D", "M", "D", "F", "S"],
		max, date,
		cssBox = {
			position: "absolute",
			top : "245px",
			right : "10px",
			width : "240px",
			height : "200px",
			background : "#FAEBD7",
			border : "solid 2px #BC9F75",
			margin: "0",
			padding : "10px 10px 0px 10px",
			textAlign : "center",
			borderRadius : "10px"
		},
		cssBar = {
			width : "31px",
			height : "0px",
			position : "absolute",
			bottom : "0px",
			left : "10px",
			borderRadius : "0px",
			border: "1px #000 solid",
			background: "#BC9F75",
			overflow : "hidden"
		},
		box = $("<div id=\"weekdayGraph\">Verteilung über Wochentage</div>").css(cssBox),
		bar, i;
		for (i = 0; i < listlength; i += 1) {
			date = new Date(list[i].date * 1000);
			wdays[date.getDay()] += 1;
		}
		max = wdays.max();
		for (i = 0; i < 7; i += 1) {
			cssBar.height = Math.round((wdays[i] / max) * 180) + "px";
			cssBar.left = (i * 35) + 10 + "px";
			bar = $("<div id=\"weekdayGraphBar" + (i + 1) + "\">" + abr[i] + "<br>" + wdays[i] +  "</div>").css(cssBar);
			box.append(bar);
		}
		result.append(box);
	},
	hourGraph = function () {
		var hours = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		max, date,
		cssBox = {
			position: "absolute",
			top : "480px",
			right : "10px",
			width : "240px",
			height : "200px",
			background : "#FAEBD7",
			border : "solid 2px #BC9F75",
			margin: "0",
			padding : "10px 10px 0px 10px",
			textAlign : "center",
			borderRadius : "10px"
		},
		cssBar = {
			width : "6px",
			height : "0px",
			position : "absolute",
			bottom : "0px",
			left : "10px",
			borderRadius : "0px",
			border: "1px #000 solid",
			background: "#BC9F75",
			overflow : "hidden",
			fontSize : "8px",
		},
		box = $("<div id=\"hourGraph\">Verteilung über Tageszeit</div>").css(cssBox),
		bar, i;
		for (i = 0; i < listlength; i += 1) {
			date = new Date(list[i].date * 1000);
			hours[date.getHours()] += 1;
		}
		max = hours.max();
		for (i = 0; i < 24; i += 1) {
			cssBar.height = Math.round((hours[i] / max) * 180) + "px";
			cssBar.left = (i * 10) + 10 + "px";
			bar = $("<div id=\"hourGraphBar" + (i + 1) + "\">" + i + "</div>").css(cssBar);
			box.append(bar);
		}
		result.append(box);
	};
			
			
	$(function () {
		$.ajax({
			"url" : "http://unpunk.de/kniffel/list/index.php",
			"dataType" : "json",
			"data" : {"get" : "all",
				"top" : "all",
				"best" : "f",
				"record" : "f",
				"format" : "json"},
			"success" : handleData
		});
	});


}(jQuery, this));

