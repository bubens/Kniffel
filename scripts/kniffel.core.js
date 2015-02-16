/* jshint strict:true */
/* global util */

kniffel.constants = {
	IS_3_OF_A_KIND : 3,
	IS_4_OF_A_KIND : 4,
	IS_5_OF_A_KIND : 5,
	IS_FULL_HOUSE : "f",
	IS_SMALL_STRAIGHT : 4,
	IS_LARGE_STRAIGHT : 5
};

kniffel.kniffel = (function (kniffel, global) {
	"use strict";
	var $public = {},
	$private = {};
	
	$private.flags = {};
	$private.flags.activeReplay = false;
	$private.flags.entered = false;
	$private.flags.rolled = false;
	$private.flags.gameover = false;
	$private.flags.replay = false;
	$private.flags.undone = false;
	
	$private.record = [];
	$private.record.add = function (move) {
		$private.record.push(move);
	};
	$private.record.undo = function () {
		$private.record.pop();
	};
	$private.record.dump = function () {
		return $private.record.join("");
	};
	$private.record.reset = function () {
		while ($private.record.pop()) {
			//do;
		}
	};
	
	$private.togo = null;
	
	$private.dice = [];
	$private.dice.click = function (n) {
		$private.dice[n].hold();
	};
	$private.dice.roll = function () {
		var i;
		if (!$private.flags.activeReplay) {
			if ($private.togo.decrement()) {
				for (i=0; i<5; i+=1) {
					$private.dice[i].roll();
				}
			}
			else {
				kniffel.prompt.blink("Alle Würfe geworfen.");
			}
			$private.flags.rolled = true;
			$private.record.add($private.dice.getValue(true));
		}
		//kniffel.prompt.blink($private.record);
	};
	$private.dice.getValue = function (str) {
		var i, d, tmp;
		if (!str) {
			tmp = [];
			for (i=0; i<5; i+=1) {
				tmp.push($private.dice[i].getValue());
			}
		}
		else {
			tmp = "mvrx";
			for (i=0; i<5; i+=1) {
				d = $private.dice[i];
				tmp += d.getValue()+"";
				tmp += (d.isHeld()) ?"hx" :"x";
			}
		}
		return tmp;
	};
	$private.dice.reset = function () {
		var i;
		for (i=0; i<5; i+=1) {
			$private.dice[i].reset();
		}
	};
	
	$private.entries = {};
	$private.entries.last = "";
	$private.entries.enter = function (id) {
		var entry = id.split("_")[1],
		x = 0;
		if (!$private.flags.rolled || $private.flags.gameover) {
			return false;
		}
		if (!$private.flags.entered && !$private.entries[id].locked()) {
			if (!global.isNaN(entry)) {
				x = $public.functions.addUp(+entry);
				$private.entries[id].enter(x);
				$private.sums.up.add(x);
				if (!$private.sums.bonus.given()) {
					$private.sums.bonus.add(x);
					if ($private.sums.bonus.given()) {
						x += $private.sums.bonus.getValue();
					}
				}
			}
			else {
				switch (entry) {
					case "dp":
						if ($public.functions.isOfAKind(kniffel.constants.IS_3_OF_A_KIND)) {
							x = $public.functions.addUp();
						}
						break;
					case "vp":
						if ($public.functions.isOfAKind(kniffel.constants.IS_4_OF_A_KIND)) {
							x = $public.functions.addUp();
						}
						break;
					case "kn":
						if ($public.functions.isOfAKind(kniffel.constants.IS_5_OF_A_KIND)) {
							x = 50;
						}
						break;
					case "fh":
						if ($public.functions.isOfAKind(kniffel.constants.IS_FULL_HOUSE)) {
							x = 25;
						}
						break;
					case "ch":
						x = $public.functions.addUp();
						break;
					case "ks":
						if ($public.functions.isStraight(kniffel.constants.IS_SMALL_STRAIGHT)) {
							x = 30;
						}
						break;
					case "gs":
						if ($public.functions.isStraight(kniffel.constants.IS_LARGE_STRAIGHT)) {
							x = 40;
						}
						break;
					default:
						kniffel.prompt.blink("Oha... das hätte nicht passieren dürfen.");
						break;
				}
				$private.entries[id].enter(x);
				$private.sums.down.add(x);
			}
			
			$private.sums.all.add(x);
			$private.togo.zero();	
			$private.flags.entered = true;
			$private.flags.undone = false;
			$private.entries.last = entry;
			
			$private.record.add("mvex"+entry+"x"+x+"x"+$private.sums.up.getValue()+"x"+$private.sums.bonus.getValue()+"x"+$private.sums.down.getValue()+"x"+$private.sums.all.getValue());
			
			//kniffel.prompt.blink($private.record);
			if ($public.functions.isFilledOut()) {
				$private.flags.gameover = true;
				if ($private.flags.replay) {
					$private.replay.playRound();
				}
				else {
					$private.gameOver();
				}
			}
		}
		else {
			kniffel.prompt.blink("Wert bereits eingetragen!");
		}
		return true;
	};
	$private.entries.reset = function () {
		var i,
		entries = $private.entries;
		for (i in entries) {
			if (entries.hasOwnProperty(i) && entries[i].reset) {
				entries[i].reset();
			}
		}
		return true;
	};
	
	$private.sums = {};
	
	$private.replay = {};
	$private.replay.name = "";
	$private.replay.entries = {};
	$private.replay.entries.reset = function () {
		var i,
		entries = $private.replay.entries;
		for (i in entries) {
			if (entries.hasOwnProperty && entries[i].reset) {
				entries[i].reset();
			}
		}
		return true;
	};
	$private.replay.sums = {};
	$private.replay.round = null;
	$private.replay.record = "";
	
	$private.replay.init = function (str) {
		var i, j, k, l, tmp = [];
		tmp = str.split("trn");
		for (i=0, l=tmp.length; i<l; i+=1) {
			tmp[i] = tmp[i].split("mv");
			tmp[i].shift();
			for (j=0, k=tmp[i].length; j<k; j+=1) {
				tmp[i][j] = tmp[i][j].split("x");
			}
		}
		return tmp;
	};
	$private.replay.playRound = function () {
		$private.flags.activeReplay = true;
		if ($private.replay.record.length > 0) {
			$private.replay.round = $private.replay.record.shift();
			var exec = function () {
				var r, t=/h/;
				if ($private.replay.round.length > 0) {
					r = $private.replay.round.shift();
					if (r[0] == "r") {
						$private.dice[0].rollTo(global.parseInt(r[1]), t.test(r[1]));
						$private.dice[1].rollTo(global.parseInt(r[2]), t.test(r[2]));
						$private.dice[2].rollTo(global.parseInt(r[3]), t.test(r[3]));
						$private.dice[3].rollTo(global.parseInt(r[4]), t.test(r[4]));
						$private.dice[4].rollTo(global.parseInt(r[5]), t.test(r[5]));
					}
					else {
						$private.replay.entries[r[1]].set(r[2]);
						$private.replay.sums.bonus.set(global.parseInt(r[3]) || "");
						$private.replay.sums.up.set(global.parseInt(r[4]) || "");
						$private.replay.sums.down.set(global.parseInt(r[5]) || "");
						$private.replay.sums.all.set(global.parseInt(r[6]) || "");
					}
					global.setTimeout(exec, 500);
				}
				else {
					$private.dice.reset();
					$private.flags.activeReplay = false;
					if ($private.flags.gameover) {
						$private.gameOver();
					}
				}
			};
			exec();
		}
	};
	
	$private.gameOver = function () {
		var i = $private.sums.all.getValue(),
		nm, y, win = "",
		cmt = kniffel.getComment(i),
		txt = "", name, conf,
		check = function (n) {
			if (n.length > 8) {
				return false;
			}
			return (/^[\wäöü]+$/.test(n));
		};
		if ($private.flags.replay) {
			nm = $private.replay.name;
			win = "Du hast das Spiel gegen "+nm;
			y = $private.replay.sums.all.getValue();
			win += (i > y) ?" gewonnen.\n\n" :" verloren.\n\n";
		}
	
		txt += "Das Spiel ist vorbei. Du hast "+i+" Punkte erreicht.\n\n"+cmt+"\n\n"+win;
		if (global.navigator.cookieEnabled) {
			txt = txt+"Spiel eintragen?";
			conf = global.confirm(txt);
		}
		else {
			alert(txt);
			return true;
		}
		if (conf) {
			name = util.keks.get("player");
			name = global.prompt("Name eingeben (0-8 Zeichen):", name || "");
			if (!name) {
				return false;
			}
			else if (!check(name)) {
				while (!check(name)) {
					name = global.prompt("Fehler: Name eingaben (0-8 Zeichen, keine Sonderzeichen)");
				}
			}
			util.keks.set("player", name, "30d");
			$private.highscore.enter("n="+name+"&p="+i+"&r="+$private.record.dump());
			return true;
		}
	};
	
	$private.highscore = {};
	$private.highscore.request = new XMLHttpRequest();
	$private.highscore.enter = function (param) {
		kniffel.loader.show();
		if ($private.highscore.request.readyState === 0) {
			$private.highscore.request.open("post", "list/enter.php", true);
			$private.highscore.request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			$private.highscore.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			$private.highscore.request.onreadystatechange = function () {
				if ($private.highscore.request.readyState == 4) {
					if ($private.highscore.request.status == 200) {
						$private.highscore.handleResponse($private.highscore.request);
					}
					else {
						kniffel.loader.hide();
					}
				}
			};
			$private.highscore.request.send(param);
		}
		else {
			$private.highscore.request.abort();
			$private.highscore.enter(param);
		}
		return true;
	};		
	$private.highscore.handleResponse = function (request) {
		var response = util.json.parse(request.responseText);
		if (response) {
			if (response.status == "success") {
				var url = location.protocol+"//"+location.host+location.pathname+"?gid="+response.message,
				input = $("gameid");
				
				kniffel.prompt.show("Spiel erfolgreich eingetragen!");
				input.value = url;
				input.disabled = false;
				$("againstme").href = url;
			}
			else {
				kniffel.blink("Fehler bei Eintragung!");
			}
		}
		kniffel.loader.hide();
		kniffel.list.reload();
	};	
	
	$private.init = function () {
		// prepare replay if provided
		if (!!kniffel.challenge) {
			$private.flags.replay = true;
			$private.replay.name = kniffel.challenge.name;
			$private.replay.record = $private.replay.init(kniffel.challenge.game);
		}
		
		
		// begin initializing objects
		$private.togo = new kniffel.Togo("togo");
		
		$private.dice.push(new kniffel.Dice(80, "dice_cvs_0", "dice_cvs", "dice_0"),
			new kniffel.Dice(80, "dice_cvs_1", "dice_cvs", "dice_1"),
			new kniffel.Dice(80, "dice_cvs_2", "dice_cvs", "dice_2"),
			new kniffel.Dice(80, "dice_cvs_3", "dice_cvs", "dice_3"),
			new kniffel.Dice(80, "dice_cvs_4", "dice_cvs", "dice_4"));
		
		$private.entries.entry_1 = new kniffel.Entry("entry_1");
		$private.entries.entry_2 = new kniffel.Entry("entry_2");
		$private.entries.entry_3 = new kniffel.Entry("entry_3");
		$private.entries.entry_4 = new kniffel.Entry("entry_4");
		$private.entries.entry_5 = new kniffel.Entry("entry_5");
		$private.entries.entry_6 = new kniffel.Entry("entry_6");
		$private.entries.entry_dp = new kniffel.Entry("entry_dp");
		$private.entries.entry_vp = new kniffel.Entry("entry_vp");
		$private.entries.entry_fh = new kniffel.Entry("entry_fh");
		$private.entries.entry_ks = new kniffel.Entry("entry_ks");
		$private.entries.entry_gs = new kniffel.Entry("entry_gs");
		$private.entries.entry_kn = new kniffel.Entry("entry_kn");
		$private.entries.entry_ch = new kniffel.Entry("entry_ch");
		
		$private.sums.up = new kniffel.Sum("sum_up");
		$private.sums.down = new kniffel.Sum("sum_down");
		$private.sums.all = new kniffel.Sum("sum_all");
		$private.sums.bonus = new kniffel.Bonus("bonus");
		
		if ($private.flags.replay) {
			$private.replay.entries["1"] = new kniffel.sEntry("sentry_1");
			$private.replay.entries["2"] = new kniffel.sEntry("sentry_2");
			$private.replay.entries["3"] = new kniffel.sEntry("sentry_3");
			$private.replay.entries["4"] = new kniffel.sEntry("sentry_4");
			$private.replay.entries["5"] = new kniffel.sEntry("sentry_5");
			$private.replay.entries["6"] = new kniffel.sEntry("sentry_6");
			$private.replay.entries.dp = new kniffel.sEntry("sentry_dp");
			$private.replay.entries.vp = new kniffel.sEntry("sentry_vp");
			$private.replay.entries.fh = new kniffel.sEntry("sentry_fh");
			$private.replay.entries.ks = new kniffel.sEntry("sentry_ks");
			$private.replay.entries.gs = new kniffel.sEntry("sentry_gs");
			$private.replay.entries.kn = new kniffel.sEntry("sentry_kn");
			$private.replay.entries.ch = new kniffel.sEntry("sentry_ch");
			$private.replay.sums.up = new kniffel.sEntry("ssum_up");
			$private.replay.sums.bonus = new kniffel.sEntry("sbonus");
			$private.replay.sums.down = new kniffel.sEntry("ssum_down");
			$private.replay.sums.all = new kniffel.sEntry("ssum_all");
		}
		
		// end initializing objects
		
		// begin inititalizing events
		util.event.add($("dice_0"), "click", $private.dice.click.curry(0));
		util.event.add($("dice_1"), "click", $private.dice.click.curry(1));
		util.event.add($("dice_2"), "click", $private.dice.click.curry(2));
		util.event.add($("dice_3"), "click", $private.dice.click.curry(3));
		util.event.add($("dice_4"), "click", $private.dice.click.curry(4));
		
		util.event.add($("roll"), "click", $private.dice.roll);
		util.event.add($("turn"), "click", $public.next);
		util.event.add($("undo"), "click", $public.undo);
		util.event.add($("restart"), "click", $public.restart);
		
		util.event.add($("entry_1"), "click", $private.entries.enter.curry("entry_1"));
		util.event.add($("entry_2"), "click", $private.entries.enter.curry("entry_2"));
		util.event.add($("entry_3"), "click", $private.entries.enter.curry("entry_3"));
		util.event.add($("entry_4"), "click", $private.entries.enter.curry("entry_4"));
		util.event.add($("entry_5"), "click", $private.entries.enter.curry("entry_5"));
		util.event.add($("entry_6"), "click", $private.entries.enter.curry("entry_6"));
		util.event.add($("entry_dp"), "click", $private.entries.enter.curry("entry_dp"));
		util.event.add($("entry_vp"), "click", $private.entries.enter.curry("entry_vp"));
		util.event.add($("entry_fh"), "click", $private.entries.enter.curry("entry_fh"));
		util.event.add($("entry_ks"), "click", $private.entries.enter.curry("entry_ks"));
		util.event.add($("entry_gs"), "click", $private.entries.enter.curry("entry_gs"));
		util.event.add($("entry_kn"), "click", $private.entries.enter.curry("entry_kn"));
		util.event.add($("entry_ch"), "click", $private.entries.enter.curry("entry_ch"));		
	};
	
	$public.next = function () {
		if ($private.flags.entered) {
			$private.dice.reset();
			$private.togo.reset();
			$private.flags.entered = false;
			$private.flags.rolled = false;
			$private.record.add("trn");
			if ($private.flags.replay) {
				$private.replay.playRound();
			}
		}
		else {
			kniffel.prompt.blink("Noch keinen Wert eingetragen!");
		}
	};
	
	$public.undo = function () {
		var entry = $private.entries.last;
		if (!$private.flags.undone && $private.flags.entered && $private.flags.rolled && !$private.flags.gameover) {
			$private.entries["entry_"+entry].reset();
			if (!global.isNaN(entry)) {
				$private.sums.up.undo();
				$private.sums.bonus.undo();
			}
			else {
				$private.sums.down.undo();
			}
			$private.sums.all.undo();
			$private.record.undo();
			$private.flags.entered = false;
			$private.flags.undone = true;
		}
		else {
			//kniffel.prompt.blink("foo");
		}
	};
	
	$public.restart = function () {
		if (global.confirm("Neues Spiel starten?")) {
			$private.dice.reset();
			$private.entries.reset();
			$private.sums.up.reset();
			$private.sums.bonus.reset();
			$private.sums.down.reset();
			$private.sums.all.reset();
			$private.togo.reset();
			$private.flags.activeReplay = false;
			$private.flags.entered = false;
			$private.flags.rolled = false;
			$private.flags.gameover = false;
			$private.record.reset();
			
			if ($private.flags.replay) {
				$private.replay.record = $private.replay.init(kniffel.challenge.game);
				$private.replay.entries.reset();
				$private.replay.sums.up.reset();
				$private.replay.sums.bonus.reset();
				$private.replay.sums.down.reset();
				$private.replay.sums.all.reset();
			}
		}
		return true;
	};
	
	$public.functions = {};
	$public.functions.addUp = function (v) {
		var x = 0,
		dices = $private.dice.getValue(),
		i, l = dices.length;
		for (i=0; i<l; i+=1) {
			x += (v) ?(dices[i] === v) ?v :0 :dices[i];
		}
		return x;
	};
	$public.functions.isFilledOut = function () {
		var s = true, p,
		entries = $private.entries;
		for (p in entries) {
			if (entries.hasOwnProperty(p)) {
				if (entries[p].locked) {
					s = s && entries[p].locked();
				}
			}
		}
		return s;
	};
	$public.functions.isOfAKind = function (n) {
		var a = $private.dice.getValue(),
		i, j, l = a.length,
        t = 0,
        c = {"3":6,"4":12,"5":20,"f":8};
		
		for (i=0; i<l; i+=1) {
			for (j=0; j<l; j+=1) {
				t += (i!==j && a[i]===a[j]) ?1 :0;
			}
		}
		return (!global.isNaN(n)) ?(t >= c[n]) :(t === c[n]);
	};
	// documented because of higher complexity (i think)
	$public.functions.isStraight = function (n) {
		var a = $private.dice.getValue(),
		g = 0, q = 0,
		p = 0, i,
		r1,r2,r3,r4; //results
		a = a.sort(function (a,b) {return (a===b)?0:(a>b)?1:-1;});
		for (i=0; i<a.length; i+=1) {
			//count elements that are 1 greater than the previous!
			g += (a[i+1] === a[i]+1) ?1 :0;

			//count elements that equal the previous!
			q += (a[i+1] === a[i]) ?1 :0;

			//remember index of an element that is 2 lesser than next
			p += (a[i+1] === a[i]+2) ?i :0;
		}

		//do we want at least 4 numbers in a row? (n>=4)
		//AND do we have 4 numbers that are 1 greater than the previous? (g==4)
		//(which makes 5 in a row)
		r1 = (n>=4 && g===4);

		//OR:

		//do we want 4 numbers in a row? (n==4)
		//AND do we habe 4 numbers that are 1 greater than the previous? (g==3)
		r2 = (n===4 && g===3);

		//problem: what about [1,2,3,5,6]? g would be 3 but it would be no straight.
		//to find out more about our list, we test for possible patterns.
		//we ask:
		//do we have a number that is two lesser than next on the
		//zeroth (p==0) OR third position (p==3)?
		//(only positions possible in a straight)
		r3 = (p===3 || p===0);

		//OR:

		//do we have only one pair of equal numbers in our list? (q==1)
		//only one possible
		r4 = (q===1);

		//we combine and return our results:
		//in words:
		//we want at least and have exactly 5 in a row _OR_
		//we want 4 in a row and have 4 numbers that are one greater
		//than the previous _AND_
			//we assure that the only positions where the next number
			//is two greater is on zeroth or third position _OR_
			//that we only have one pair of equal numbers
		return r1 || (r2 && (r3||r4));
	};
	
	util.event.add(global, "load", $private.init);
	//$public.init = $private.init;
	return $public;
}(kniffel, window));
	
	
