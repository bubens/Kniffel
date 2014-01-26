<?php
/* n00bme
 * */

session_start();
$t1 = microtime(True);

include "class_highscore.php";
include "lib_highscore.php";

if (isset($_COOKIE["player"])) {
	$NAME = $_COOKIE["player"];
}
else {
	$NAME = False;
};

$isAjax = $_SERVER["HTTP_X_REQUESTED_WITH"];

$GET = check_and_set($_GET["get"], "default", "check_get");
$TOP = check_and_set($_GET["top"], "all", "check_number");
$FORMAT = check_and_set($_GET["format"], "html", "check_format");
$BEST = check_and_set($_GET["best"], "t", "check_best");
$RECORD = check_and_set($_GET["record"], "f", "check_best");

$highscore = new HighscoreDB("highscore.xml");
$month = (int)date("n");
$year = (int)date("y");

if ($GET == "default") {
	$highscore->entries_this_month();
}
else if (preg_match("/month=\d+/", $GET)) {
	$list = explode("=", $GET);
	$list = str_split($list[1], 2);
	$highscore->entries_by_month($list[0], $list[1]);
	$month = (int)$list[0];
	$year = (int)$list[1];
}
else if (preg_match("/name=\w+/", $GET)) {
	$list = explode("=", $GET);
	$highscore->entries_by_name($list[1]);
}
else if (preg_match("/days=\d+/", $GET)) {
	$list = explode("=", $GET);
	$highscore->entries_by_daysgoneby((int)$list[1]);
}
else if (preg_match("/last=\d+/", $GET)) {
	$list = explode("=", $GET);
	$x = (int)$list[1];
	$highscore->last_entries($x, False);
};

if ($BEST == "t") {
	$highscore->best_entries();
};

if ($TOP != "all") {
	$highscore->top_entries($TOP);
};

if ($FORMAT == "text") {
	header("Content-Type: text/plain");
	echo $highscore->dump_as_text();
}
else if ($FORMAT == "json") {
	header("Content-Type: text/javascript");
	echo $highscore->dump_as_json(($RECORD == "t"));
}
else {
	header("Content-Type: text/html");
	$html = $highscore->dump_as_html();
	if ($isAjax != "XMLHttpRequest") {
		$general = new HighscoreDB("highscore.xml");
		$data = "<ul>";
		$data = $data.'<li>Insgesamt '.count($general->dump()).' Einträge mit durchschnittlich '.$general->average().' Punkten</li>';
		if ($NAME) {
			$yrlast = $general->get_last_entry_by_name($NAME);
			$yrbest = $general->get_best_entry_by_name($NAME);
			$data = $data.'<li><b>Dein letzter Eintrag:</b><br />'.$yrlast["points"].' Punkte ('.HighscoreDB::twitterfy_date($yrlast["date"]).')</li>';
			$data = $data.'<li><b>Dein bester Eintrag:</b><br />'.$yrbest["points"].' Punkte ('.HighscoreDB::twitterfy_date($yrbest["date"]).')</li>';
		};
		$last = $general->get_last_entries(1, False);
		$data = $data.'<li><b>Letzter Eintrag:</b><br />'.$last[0]["name"].' mit '.$last[0]["points"].' ('.HighscoreDB::twitterfy_date($last[0]["date"]).')</li>';
		$data = $data."</ul>";
		$html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
       "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>roll\'em - the highscores</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta http-equiv="content-script-type" content="text/javascript" />
<meta http-equiv="content-style-type" content="text/css" />
<meta http-equiv="content-language" content="de" />
<link href="feed.xml" type="application/rss+xml" rel="alternate" title="roll\'em - Die Liste" />
<link href="../styles/styles.css" type="text/css" rel="stylesheet" />
<style type="text/css">
#feed img {
	border : 0;
}

#feed {
	position : relative;
	top : -33px;
	left : 250px;
	
}
</style>
<script type="text/javascript" src="scripts/util.js"></script>
</head>
<body>
<h1>Kniffel-Maschine Highscores -  '.what_month($month).' 20'.$year.'</h1>
<div id="container">
	<div id="list">'.$html.'</div>
</div>
<div id="etc">
	<div id="details">
		<h2>Details</h2>
		'.$data.'		
	</div>
	<div id="navigation">
		<h2>Highscores</h2>
		<div id="feed"><a href="feed.xml" title="Alle Einträge als RSS-Feed abonnieren"><img src="../media/feed.png" /></a></div>
		'.create_month_switcher($month, $year).'
		'.create_best_switch($BEST, $month, $year).'
	</div>
	<a id="etc_link_analyze" class="etc_link" href="./analyse">Highscore Statistik</a>
	<a id="etc_link_kniffel" class="etc_link" href="../" title="Zur Highscore-Liste">Zurück zu Kniffel</a>
	<a id="etc_link_unpunk" class="etc_link" href="http://unpunk.de" title="Zu unpunk.de">Zurück zu unpunk.de</a>
</div>
<div id="loadtime">'.(microtime(True)-$t1).'s</div>
</body>
</html>';
	};
	echo $html;
}

?>
