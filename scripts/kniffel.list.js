"use strict";

if (!window.kniffel) {
	var kniffel = {};
}

kniffel.list = (function (kniffel, global) {
	var $private = {},
	$public = {};
	
	$private.request = new XMLHttpRequest();
	$private.timeout = 0;
	$private.reload = function () {
		kniffel.loader.show();
		if ($private.request.readyState === 0) {
			$private.request.open("get", "list/index.php?top=10&format=json", true);
			$private.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			$private.request.onreadystatechange = function () {
				if ($private.request.readyState == 4) {
					if ($private.request.status == 200) {
						$private.toDOM($private.request.responseText);
					}
					kniffel.loader.hide();
				}
			}
			$private.request.send(null);
		}
		else {
			$private.request.abort();
			$private.reload();
		}
	};
	
	$private.toDOM = function (txt) {
		var rsp = util.json.parse(txt), 
		list, i, l,
		entry, url,
		a, rank, name, points, date, row,
		table = $("list_highscore");
		util.element.empty(table);
		if (rsp) {
			list = rsp.list;
			l = list.length;
			if (l > 0) {
				for (i=0; i<l; i+=1) {
					entry = list[i];
					url = location.pathname+"?gid="+entry.gid;
					a = util.element.create("a", entry.name, {title:"Spiele gegen "+entry.name, href:url});
					rank = util.element.create("td", i+1, {className:"list_index"});
					name = util.element.create("td", a, {className:"list_name"});
					points = util.element.create("td", entry.points, {className:"list_points"});
					date = util.element.create("td", "("+util.time.twitterfy(entry.date*1000)+")", {className:"list_date"});
					row = util.element.create("tr", rank, {className:"list_entry"});
					row.appendChild(name);
					row.appendChild(points);
					row.appendChild(date);
					table.appendChild(row);
				}
			}
			else {
				util.element.empty(table);
				table.appendChild(util.element.create("div", "Noch keine Einträge", {className:"list_info"}));
			}
		}
		else {
			if (global.console && global.console.warn) {
				console.warn("Bad Ajax-Response.");
			}
		}
	};
	
	
	$private.exec = function () {
		$private.reload();
		$private.timeout = global.setTimeout($private.exec, 120000);
	};
	
	$public.reload = function () {
		$private.reload();
	};
	
	util.event.add(window, "load", $private.exec);
	
	return $public;
}(kniffel, window));
