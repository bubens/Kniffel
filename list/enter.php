<?php

session_start();

include "class_highscore.php";
include "lib_highscore.php";

$message = "";
$status = "";
$highscore = new HighscoreDB("highscore.xml");

# hat das spiel lange genug gedauert?
if (isset($_SESSION["t_game_start"])) {
	$game_time = time() - $_SESSION["t_game_start"];
}
else {
	$game_time = 0;
}

# und kommt der eintrag aus richtung ajax?
if (isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
	$requested_with = $_SERVER["HTTP_X_REQUESTED_WITH"];
}
else {
	$requested_with = "other";
}


# and now to serious business
if ($requested_with == "XMLHttpRequest" && $game_time > 60) {
	if (isset($_POST["p"])) {
		$name = checkName($_POST["n"]);
		$points = checkPoints($_POST["p"]);
		$record = checkRecord($_POST["r"]);
		$date = time();
		$gid = uniqid();
		if ($name && $points && $record) {
			$highscore->add_entry($name, $points, $date, $record, $gid);
			sync_the_feed($name, $points, $date, $gid);
			$status = "success";
			$message = $gid;
			$_SESSION["t_game_start"] = time();
		}
		else {
			$status = "error";
			$message = "checkfail";
		}
	}
	
	
}
else if ($game_time <= 60) {
	$status = "error";
	$message = "too fast";
}
else if ($requested_with != "XMLHttpRequest") {
	$status = "error";
	$message = "no uh uhh";
}
else {
	$status = "error";
	$response = "unknown error";
};

header("Content-Type: application/x-json");
#var_dump($_SERVER);
echo "{\"status\":\"$status\",\"message\":\"$message\"}";
?>
