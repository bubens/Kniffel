<?php
/* n00bme
 * */

session_start();
$t1 = microtime(True);


include "lib_highscore.php";
include "../config/config.php";

$mysql = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($mysql->connect_errno) {
	die("Fehler bei der Verbindung mit der Datenbank:<br>".$mysql->connect_error);
}

if (isset($_COOKIE["player"])) {
	$NAME = $_COOKIE["player"];
}
else {
	$NAME = False;
};

// in case it's "XMLHttpRequest" send only barebones html-list
$requested_with = $_SERVER["HTTP_X_REQUESTED_WITH"];

$month = (int)date("n");
$year = (int)date("y");

$filter = check_and_set($_GET["get"], "default", "check_get");
$ORDERED = check_and_set($_GET["ordered"], "t", "check_best");
$TOP = check_and_set($_GET["top"], "all", "check_number");
$FORMAT = check_and_set($_GET["format"], "html", "check_format");
$BEST = check_and_set($_GET["best"], "t", "check_best");
$RECORD = check_and_set($_GET["record"], "f", "check_best");

// kobble together the db-query
$query = "SELECT name, CAST(points AS UNSIGNED) AS points, UNIX_TIMESTAMP(date) AS date, id AS gid";
if ($RECORD == "t") {
	$query .= ", record";
} 
$query .= " FROM scores";

// see lib_highscore.php for details
$filter = parse_get($filter);

if ($filter["filter"] == "all") {
	$query .= "";
}	
else if ($filter["filter"] == "month") {
	$month = $filter["value"]["month"];
	$year = $filter["value"]["year"];
	$query .= " WHERE MONTH(date) = ".$month." AND YEAR(date) = 20".$year;
}
else if ($filter["filter"] == "name") {
	$query .= " WHERE name = '".$filter["value"]."'";
}
else if ($filter["filter"] == "days") {
	$query .= " WHERE DATE_SUB(CURDATE(), INTERVAL ".$filter["value"]." DAY) <= date";
}
else if ($filter["filter"] == "last") {
	$query .= " WHERE (SELECT COUNT(*) FROM scores) - 10 < id";
}
else {
	$query .= " WHERE MONTH(date) = ".$month." AND YEAR(date) = 20".$year;
}

if ($ORDERED == "t") {
	$query .= " ORDER BY points DESC;";
}
else {
	$query .= " ORDER BY gid DESC";
}

// query that thing
$result = $mysql->query($query);

if (!$result) {
	die("Fehler bei der Datenbankabfrage: ".$mysql->error);
}

// transform the query-result into a handy assoc
$list = transform_mysql_to_assoc($result);


// do the rest of the filter magic
if ($BEST == "t") {
	$list = highest_per_user($list);
};

if ($TOP != "all") {
	$list = array_slice($list, 0, $TOP);
};

#var_dump($list);

header("X-Powered-By: love and strong coffee!");
header("Server: Redstone-x86/2.2.23 (with cows)");
if ($FORMAT == "text") {
	$textout = gzencode(make_text($list));
	
	header("Content-Type: text/plain");
	header("Content-Encoding: gzip");
	header("Content-Length: ".strlen($textout));
	echo $textout;
}
else if ($FORMAT == "json") {
	$output = array("list"=>$list, "created"=>date("D, d M Y H:i:s"), "time"=>(microtime(TRUE) - $t1));
	$jsonout = gzencode(json_encode($output));
	
	header("Content-Type: text/javascript");
	header("Content-Encoding: gzip");
	header("Content-Length: ".strlen($jsonout));
	echo $jsonout;
}
else if ($FORMAT == "xml") {
	$xmlout = gzencode(make_xml($list));
	
	header("Content-Type: text/xml");
	header("Content-Encoding: gzip");
	header("Content-Length: ".strlen($xmlout));
	echo $xmlout;
}
else if ($FORMAT == "csv") {
	$csvout = gzencode(make_csv($list));
	
	header("Content-Type: text/csv");
	header("Content-Disposition: attachement; filename=".date("ymd")."_rollem_scores.csv");
	header("Content-Encoding: gzip");
	header("Content-Length: ".strlen($csvout));
	echo $csvout;
}
else {
	$last_entry = get_last($mysql);

	$html = file_get_contents("templates/index.template.html");
	$html = str_replace("%month%", get_month_name($month), $html);
	$html = str_replace("%year%", $year, $html);
	$html = str_replace("%list_html%", create_list($list), $html);
	$html = str_replace("%entries_number%", get_number($mysql), $html);
	$html = str_replace("%entries_average%", get_average($mysql), $html);
	$html = str_replace("%entry_last_name%", $last_entry["name"], $html);
	$html = str_replace("%entry_last_points%", $last_entry["points"], $html);
	$html = str_replace("%entry_last_date%", twitterfy_date($last_entry["date"]), $html);
	$html = str_replace("%month_switcher%", create_month_switcher($month, $year), $html);
	$html = str_replace("%best_switcher%", create_best_switcher(), $html);
	$html = str_replace("%loadtime%", microtime(True) - $t1, $html);
	
	header("Content-Type: text/html");
	header("Content-Length: ".strlen($html));
	header("Content-Encoding: gzip");
	
	echo gzencode($html);
	
}

?>
