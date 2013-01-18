<?php

session_start();

$t1 = microtime(True);

include "list/class_highscore.php";
include "list/lib_highscore.php";
$highscore = new HighscoreDB("list/highscore.xml");

$highscore->entries_this_month();
$highscore->best_entries();
$highscore->top_entries(10);

$_SESSION["t_game_start"] = time();

function checkGID ($gid) {
	return preg_match("/^\d+$/", $gid);
};

if (isset($_COOKIE["player"])) {
	$_SESSION["d_player"] = $_COOKIE["player"];
	$game_name = $_COOKIE["player"];
};

if (isset($_GET["gid"])) {
	$replay_game = $highscore->get_entry_by_gid($_GET["gid"]);
	if ($replay_game) {
		$replay_is = TRUE;
		$replay_record = $replay_game["record"];
		$replay_name = $replay_game["name"];
		$replay_date = $replay_game["date"];
	}
}
else {
	$replay_is = FALSE;
};

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
       "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>roll'em - a Kniffel machine</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="content-script-type" content="text/javascript" />
<meta http-equiv="content-style-type" content="text/css" />
<meta http-equiv="content-language" content="de" />
<link href="list/feed.xml" type="application/rss+xml" rel="alternate" title="roll'em - Die Liste" />
<link href="styles/styles.css" type="text/css" rel="stylesheet" />
<style type="text/css">
#flattr {
	position: absolute;
	bottom: 10px;
	left: 20px;
}
</style>
<script type="text/javascript" src="scripts/util.js"></script>
<script type="text/javascript" src="scripts/kniffel.min.js"></script>
<?php
if ($replay_is) {
	echo "<script type=\"text/javascript\">kniffel.challenge={};kniffel.challenge.game=\"$replay_record\";kniffel.challenge.name=\"$replay_name\"</script>\n";
}?>
</head>
<body>
<h1>Kniffel-Maschine -  roll'em <img id="loader" src="media/loader.gif" width="20" height="20" alt="Ajax Loader"/></h1>
<noscript>
	<div id="noscript">Dieses Stück Zeitvertreib benötigt Javascript um zu funktionieren. Scheinbar ist dein Javascript abgeschaltet. Das macht fast überall Sinn (zugegeben) nur hier nicht. Um roll'em zu spielen Javascript einschalten oder diese Seite whitelisten.</div>
</noscript>
<div id="kniffel">
<ul id="dicesArray">
	<li class="dice" id="dice_0"></li>
	<li class="dice" id="dice_1"></li>
	<li class="dice" id="dice_2"></li>
	<li class="dice" id="dice_3"></li>
	<li class="dice" id="dice_4"></li>
</ul>
<div id="game">
	<h2 class="name"><?php
	if (isset($game_name)) {
		echo $game_name;
	}
	else {
		echo "Du";
	}
	?></h2>
	<div class="date">&nbsp;</div>
	<ul id="sheet">
		<li class="entry" id="entry_1">Einer: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_2">Zweier: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_3">Dreier: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_4">Vierer: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_5">Fünfer: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_6">Sechser: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="sum" id="bonus">Bonus: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="sum" id="sum_up">Gesamt oben: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_dp">3er Pasch: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_vp">4er Pasch: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_fh">Full House: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_ks">kleine Straße: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_gs">große Straße: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_kn">Kniffel: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="entry" id="entry_ch">Chance: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="sum" id="sum_down">Gesamt unten: <span class="value">&nbsp;&nbsp;</span></li>
		<li class="sum" id="sum_all">Gesamt: <span class="value">&nbsp;&nbsp;</span></li>
	</ul>
</div>
<?php
if ($replay_is) {
	echo '
<div id="game2">
	<h2 class="name2">'.$replay_name.'</h2>
	<div class="date">'.(HighscoreDB::twitterfy_date($replay_date)).'</div>
	<ul id="sheet2">
		<li class="entry" id="sentry_1">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_2">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_3">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_4">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_5">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_6">&nbsp;&nbsp;</li>
		<li class="sum" id="ssum_up">&nbsp;&nbsp;</li>
		<li class="sum" id="sbonus">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_dp">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_vp">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_fh">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_ks">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_gs">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_kn">&nbsp;&nbsp;</li>
		<li class="entry" id="sentry_ch">&nbsp;&nbsp;</li>
		<li class="sum" id="ssum_down">&nbsp;&nbsp;</li>
		<li class="sum" id="ssum_all">&nbsp;&nbsp;</li>
	</ul>
</div>';
};
?>
<div id="buttons">
	<span id="togo"><span class="value">3</span> Würfe</span>
	<button id="roll" value="roll">roll</button>
	<button id="turn">turn</button>
	<button id="undo">undo</button>
	<button id="restart">restart</button>
</div>
</div>
<div id="etc">
	<div id="alerts">
		<h2>Meldungen<img id="infoPrompt" width="20" height="20" src="media/info.png" alt="Informationen" /></h2>
		<span id="prompt">Viel Spaß!</span>
	</div>
	<div id="challenge">
		<h2>Herausfordern<img id="infoChallenge" width="20" height="20" src="media/info.png" alt="Informationen" /></h2>
		<div id="chal_challenge">
			<p>Link zu diesem Spiel.</p>
			<input type="text" id="gameid" value="Spiel noch nicht beendet." readonly="readonly" disabled="disabled"/>
			<a href="http://unpunk.de/" id="againstme">Spiel selbst gegen dieses Spiel.</a>
		</div>
	</div>
	<div id="highscore">
		<h2>Highscores<img id="infoHighscore" width="20" height="20" src="media/info.png" alt="Informationen" /></h2>
		<div id="list_container">
<?php echo $highscore->dump_as_html();?>
		</div>
	</div>
	<a id="etc_link_highscore" class="etc_link" href="list" title="Zur Highscore-Liste">Zur Highscore-Liste</a>
	<a id="etc_link_unpunk" class="etc_link" href="http://unpunk.de" title="Zu unpunk.de">Zurück zu unpunk.de</a>
	<a id="flattr" href="http://flattr.com/thing/47230/rollem-die-Kniffel-Maschine" target="_blank">
		<img src="http://api.flattr.com/button/button-compact-static-100x17.png" alt="Flattr this" title="Flattr this" border="0" />
	</a>

	
</div>
<script type="text/javascript"><!--
	util.browser.onie(function () {
		var html = "<div><span id='close'>schließen</span>Scheinbar schaust du dir diese Seite mit Internet-Explorer an. Dazu muss ich leider sagen, dass diese Seite die Zusammenarbeit mit Internet-Explorer größtenteils verweigert (und andersherum) und du roll'em im Internet-Explorer (bisher) nicht spielen kannst. Schaue dir diese Seite am besten mit einem echten Browser an.</div>";
		var elem = util.element.create("div", html, {id:"warnie"});
		document.body.appendChild(elem);
		$("close").onclick = function () {
			document.body.removeChild($("warnie"));
		};
		return true;
	})
--></script>
<div id="loadtime"><?php echo microtime(True)-$t1;?>s</div>
</body>
</html>
	
