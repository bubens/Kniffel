<?php

session_start();

include "lib_highscore.php";

$cred = file_get_contents("../db/cred.json");
$cred = json_decode($cred, True);
$mysql = new mysqli($cred["host"], $cred["user"], $cred["password"], $cred["database"]);

if ($mysql->connect_errno) {
	die("Fehler bei der Verbindung mit der Datenbank:<br>".$mysql->connect_error);
}

$response = array("status"=>"error", "message"=>"unknown error");


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
		
		if ($name && $points && $record) {
			$query = "INSERT INTO scores (name, points, record) VALUES ";
			$query .= "('".$name."', ".$points.", '".$record."');";
			$result = $mysql->query($query);
			
			if (!$result) {
				$response["message"] = "database error";
			}
			else {
				$response["status"] = "success";
				$array = $mysql->query("SELECT MAX(id) AS id FROM scores;")->fetch_array();
				$response["message"] = $array["id"];
			}
			
			$_SESSION["t_game_start"] = time();
		}
		else {
			$response["message"] = "checkfail";
		}
	}
	
	
}
else if ($game_time <= 60) {
	$response["message"] = "too fast";
}
else if ($requested_with != "XMLHttpRequest") {
	$response["message"] = "no uh uhh";
}
else {
	$response["message"] = "unknown error";
};

header("Content-Type: application/x-json");
#var_dump($_SERVER);
echo json_encode($response);
?>
