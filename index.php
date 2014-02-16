<?php

session_start();
if (PHP_SAPI == "cli") {
	parse_str(implode('&', array_slice($argv, 1)), $_GET);
}

$t1 = microtime(True);

include "list/lib_highscore.php";

$_SESSION["t_game_start"] = time();

$cred = file_get_contents("db/cred.json");
$cred = json_decode($cred, True);
$mysql = new mysqli($cred["host"], $cred["user"], $cred["password"], $cred["database"]);

$_SESSION["d_player"] = $_COOKIE["player"] or NULL;
$game_name = $_COOKIE["player"] or "Du";


if (check_gid($_GET["gid"])) {
	$gid = $_GET["gid"];
}
else {
	$gid = NULL;
}

if ($gid) {
	$query = "SELECT name, CAST(points AS UNSIGNED) AS points, UNIX_TIMESTAMP(date) AS date, record FROM scores WHERE id=".$gid.";";
	$replay_result = $mysql->query($query);
	if ($replay_result) {
		$result_rows = $replay_result->num_rows;
		if ($result_rows == 1) {
			$replay_game = $replay_result->fetch_assoc();
			$replay_is = TRUE;
			$replay_record = $replay_game["record"];
			$replay_name = $replay_game["name"];
			$replay_date = $replay_game["date"];
		}
		else {
			$replay_is = FALSE;
		}
	}
	else {
		die("Database error: ".$mysql->error);
	}
}
else {
	$replay_is = FALSE;
};

$html = file_get_contents("templates/index.template.html");

$html = str_replace("%game_name%", $game_name, $html);

if ($replay_is) {
	$script = file_get_contents("templates/replay.template.js");
	$script = str_replace("%replay_record%", "\"".$replay_record."\"", $script);
	$script = str_replace("%replay_name%", "\"".$replay_name."\"", $script);
	
	$replay = file_get_contents("templates/replay.template.html");
	$replay = str_replace("%replay_name%", $replay_name, $replay);
	$replay = str_replace("%replay_date%", twitterfy_date($replay_date), $replay);
	
	$html = str_replace("%replay_script%", $script, $html);
	$html = str_replace("%replay%", $replay, $html);
}
else {
	$html = str_replace("%replay%", "", $html);
	$html = str_replace("%replay_script%", "", $html);
	$html = str_replace("%replay_name%", "", $html);
	$html = str_replace("%replay_date%", "", $html);
	$html = str_replace("%load_time%", microtime(True) - $t1, $html);
}

echo $html;

?>
	
