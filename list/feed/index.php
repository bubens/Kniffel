<?php
/* n00bme
 * */

function transform_mysql_to_assoc($result) {
	$assoc = array();
	while ($row = $result->fetch_assoc()) {
		$row["date"] = (int)$row["date"];
		array_push($assoc, $row);
	}
	return $assoc;
}

include "../../config/config.php";

$mysql = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

if ($mysql->connect_errno) {
	die("Fehler bei der Verbindung zur Datenbank: ".$mysql->connect_error);
}

$result = $mysql->query("SELECT name, points, UNIX_TIMESTAMP(date) AS date, id AS gid FROM scores WHERE (SELECT COUNT(*) FROM scores) - 10 < id ORDER BY gid DESC");
if (!$result) {
	echo "Fehler: ".$mysql->error;
}

$result = transform_mysql_to_assoc($result);

$rss = "<?xml version='1.0' encoding='utf-8'?>
<rss xmlns:atom='http://www.w3.org/2005/Atom' version='2.0'>
	<channel>
		<title>roll'em - Die Liste</title>
		<link>http://www.unpunk.de/kniffel/list</link>
		<description>Die neuesten Einträge in die Highscore-Liste des roll'em-Browser-Spiel</description>
		<language>de-DE</language>
		<copyright>Ich</copyright>
		<pubDate>".date("D, d M Y H:i:s", $result[0]["date"])."</pubDate>
		<image>
			<url>http://www.unpunk.de/lighter.png</url>
			<title>roll'em - Die Liste</title>
			<link>http://www.unpunk.de/kniffel</link>
		</image>
		<atom:link href='http://www.unpunk.de/kniffel/list/feed/' rel='self' type='application/rss+xml'/>\n";


foreach ($result as $item) {
	$item_name = $item["name"];
	$item_points = $item["points"];
	$item_gid = $item["gid"];
	$item_date = $item["date"];
	$rss .= "<item>\n";
	$rss .= "\t<title>Eintrag von ".$item_name."</title>\n";
	$rss .= "\t<description>Neuer Eintrag von ".$item_name." am ".date("d.m.y \u\m H:i", $item_date)." Uhr mit ".$item_points."</description>\n";
	$rss .= "\t<link>http://www.unpunk.de/?gid=".$item_gid."</link>\n";
	$rss .= "\t<author>kniffel@unpunk.de</author>\n";
	$rss .= "\t<guid isPermalink='true'>http://www.unpunk.de/kniffel/?gid=".$item_gid."</guid>\n";
	$rss .= "\t<pubDate>".date("D, d M Y H:i:s", $item_date)."</pubDate>\n";
	$rss .= "</item>\n";
}

$rss .= "</channel>\n";
$rss .= "</rss>";

header("Content-Type: application/rss+xml");
echo $rss;
