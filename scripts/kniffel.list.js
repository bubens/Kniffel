/* jshint strict:true */
/* global util */

kniffel.list = (function (kniffel, global) {
	"use strict";
	var $private = {},
	$public = {};
	
	$private.request = new XMLHttpRequest();
	$private.timeout = 0;
	
	$private.selection = global.localStorage.getItem("index.list.showEntries") || "best";
	
	$private.handleSelection = function ( event ) {
		var elem = event.srcElement,
		selection = elem.id.split("_")[2];
		$private.toggleSelection( selection );
	};
	
	$private.toggleSelection = function ( selection ) {
		var slct = selection || $private.selection;
		$private.selection = slct;
		$private.storeSelection( slct );
		$private.toggleClassname( slct );
		$private.exec();
	};
	
	$private.storeSelection = function ( selection ) {
		global.localStorage.setItem( "index.list.showEntries", selection || $private.selection );
	};
	
	$private.toggleClassname = function ( selection ) {
		var cls = "current_selection",
		slct = selection || $private.selection;
		$( "best_switch_best" ).classList.remove( cls );
		$( "best_switch_all" ).classList.remove( cls );
		$( "best_switch_" + slct ).classList.add( cls );
	};
	
	$private.makeURL = function () {
		var url = "list/index.php?top=10&format=json&best=";
		url += $private.selection == "best" ? "t" : "f";
		return url;
	};
	
	$private.reload = function () {
		var url = $private.makeURL();
		kniffel.loader.show();
		if ($private.request.readyState === 0) {
			$private.request.open("get", url, true);
			$private.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			$private.request.onreadystatechange = function () {
				if ($private.request.readyState == 4) {
					if ($private.request.status == 200) {
						$private.toDOM($private.request.responseText);
					}
					kniffel.loader.hide();
				}
			};
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
				table.appendChild(util.element.create("div", "Noch keine Einträge.", {className:"list_info"}));
			}
		}
		else {
			if (global.console && global.console.warn) {
				console.warn("Bad Ajax-Response.");
			}
		}
	};
	
	
	$private.exec = function () {
		global.clearTimeout( $private.timeout );
		$private.reload();
		$private.timeout = global.setTimeout($private.exec, 120000);
	};
	
	$public.reload = function () {
		$private.reload();
	};
	
	util.event.add($("best_switch_best"), "click", $private.handleSelection);
	util.event.add($("best_switch_all"), "click", $private.handleSelection);
	util.event.add(global, "load", function () {
		$private.toggleSelection();
	});
	
	return $public;
}(kniffel, window));
