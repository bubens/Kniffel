/* jshint strict:true */
/* global util */

kniffel.list = (function (kniffel, util, window) {
	"use strict";
	var request = new XMLHttpRequest(),
		timeout = 0,

		storageKey = "index.list.showEntries",
		currentClassname = "current_selection",
		requestURL = "list/index.php?top=10&format=json&best=",

		selection = window.localStorage.getItem(storageKey) || "best";

	function handleSelection(event) {
		var elem, select;
		elem = event.target;
		select = elem.id.split("_")[2];
		toggleSelection(select);
		return true;
	}

	function toggleSelection(s) {
		var slctn = s || selection;
		selection = slctn;
		storeSelection(slctn);
		toggleClassname(slctn);
		initReload();
		return true;
	}

	function storeSelection(slctn) {
		window.localStorage.setItem(storageKey, slctn || selection);
		return true;
	}

	function toggleClassname(s) {
		var slctn = s || selection,
			clss = "current_selection";

		$("best_switch_best").classList.remove(clss);
		$("best_switch_all").classList.remove(clss);
		$("best_switch_" + slctn).classList.add(clss);
		return true;
	}

	function reloadList() {
		var url = requestURL + (selection == "best" ? "t" : "f");

		kniffel.loader.show();

		if (request.readyState === 0) {
			request.open("get", url, true);
			request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			request.onreadystatechange = function () {
				if (request.readyState === 4) {
					if (request.status === 200) {
						toDOM(request.responseText);
					}
					kniffel.loader.hide();
				}
			};
			request.send(null);
		}
		else {
			request.abort();
			reloadList();
		}
		return true;
	}

	function createRow(entry, n) {
		var row, url, a, rank,
			name, points, date;

		url = location.pathname + "?gid=" + entry.gid;
		a = util.element.create("a", entry.name, { title: "Spiele gegen " + entry.name, href: url });
		rank = util.element.create("td", n, { className: "list_index" });
		name = util.element.create("td", a, { className: "list_name" });
		points = util.element.create("td", entry.points, { className: "list_points" });
		date = util.element.create("td", "(" + util.time.twitterfy(entry.date * 1000) + ")", { className: "list_date" });
		row = util.element.create("tr", rank, { className: "list_entry" });
		row.appendChild(name);
		row.appendChild(points);
		row.appendChild(date);

		return row;
	}

	function toDOM(txt) {
		var json = util.json.parse(txt),
			table = $("list_highscore"),
			list, row, info, i, l;

		if (json) {
			list = json.list;
			l = list.length;
			util.element.empty(table);
			if (l > 0) {
				for (i = 0; i < l; i += 1) {
					row = createRow(list[i], i + 1);
					table.appendChild(row);
				}
			}
			else {
				info = util.element.create("div", "Noch keine Einträge.", { className: "list_info" });
				table.appendChild(info);
			}
		}
		else {
			if (window.console && window.console.warn) {
				window.console.warn("Bad Ajax Response: " + txt);
			}
		}
	}

	function initReload() {
		window.clearTimeout(timeout);
		reloadList();
		timeout = window.setTimeout(initReload, 2 * 60 * 1000);
	}

	util.event.add($("best_switch_best"), "click", handleSelection);
	util.event.add($("best_switch_all"), "click", handleSelection);
	util.event.add(window, "load", function () { toggleSelection(); });

	return {
		reload: function () {
			reloadList();
		}
	};
}(kniffel, util, window));


