<?php

function check_and_set ($attr, $default, $filter) {
	if (isset($attr)) {
		if (call_user_func($filter, $attr)) {
			if (is_numeric($attr)) {
				return (int)$attr;
			}
			else {
				return $attr;
			};
		};
	};
	return $default;
}

function check_get ($get) {
	return (bool)preg_match("/^def|all|month=\d\d\d\d|name=\w+|days=\d+|last=\d+$/", $get);
}

function check_gid($gid) {
	if (is_numeric($gid)) {
		return True;
	}
	return False;
}


/* parse filter: array("filter"=>[filter option], "value"=>[filter value])
* filter option: check "list/doc.txt" for options
* filter value: see table
* 	+-----------+---------------------------------------------------+
* 	|	option	|		value				|
* 	+-----------+---------------------------------------------------+
* 	|	default	|	NULL					|
* 	|	all	|	NULL					|
* 	|	month	|	array(2) {				|
*	|		|		["month"]=>			|
* 	|		|			int(2)[month]		|
* 	|		|		["year"]=>			|
* 	|		|			int(2)[year]		|
* 	|		|	}					|
* 	|	name	|	string(<=8) [name]			|
* 	|	days	|	int [days]				|
* 	|	last	|	int [entries]				|
* 	+-----------+---------------------------------------------------+
*/
function parse_get($string) {
	if (preg_match("/^month=\d+$/", $string)) {
		$filter = "month";
		$array = explode("=", $string);
		$value = str_split($array[1], 2);
		$value = array("month"=>(int)$value[0], "year"=>(int)$value[1]);
	}
	else if (preg_match("/^name=[\w\d]+$/", $string)) {
		$filter = "name";
		$array = explode("=", $string);
		$value = $array[1];
	}
	else if (preg_match("/^days=\d+$/", $string)) {
		$filter = "days";
		$array = explode("=", $string);
		$value = (int)$array[1];
	}
	else if (preg_match("/^last=\d+$/", $string)) {
		$filter = "last";
		$array = explode("=", $string);
		$value = (int)$array[1];
	}
	else if ($string == "all") {
		$filter = "all";
		$value = NULL;
	}
	else {
		$filter = "default";
		$value = NULL;
	}	
	return array("filter"=>$filter, "value"=>$value);
}

function check_number ($number) {
	return (is_numeric($number) || ($number == "all"));
};

function check_format ($f) {
	return ($f == "html" || $f == "json" || $f == "text" || $f == "xml" || $f == "csv");
};

function check_best ($best) {
	return ($best == "t" || $best == "f");
};

function check_compress ($compress) {
	return ($compress == "t" || $compress == "f");
};

function checkName($name) {
	$l = strlen($name);
	if ($l > 0 && $l <= 8 && preg_match("/^[\w\d]+$/", $name)) {
		return $name;
	}
	else {
		return FALSE;
	};
};

function checkPoints($points) {
	if (preg_match("/^\d+$/", $points)) {
		return $points;
	}
	else {
		return FALSE;
	};
};


function checkRecord($record) {
	if (preg_match("/^[\w\d]+$/", $record)) {
		return $record;
	}
	else {
		return FALSE;
	};
};

function transform_mysql_to_assoc($result) {
	$assoc = array();
	while ($row = $result->fetch_assoc()) {
		$row["points"] = (int)$row["points"];
		$row["date"] = (int)$row["date"];
		$row["gid"] = (int)$row["gid"];
		$row["name"] = utf8_encode($row["name"]);
		if ($row["record"]) {
			$row["record"] = utf8_encode($row["record"]);
		}
		array_push($assoc, $row);
	}
	return $assoc;
}

function highest_per_user($list) {
	$users = array();
	$newlist = array();
	foreach ($list as $entry) {
		if (!in_array($entry["name"], $users)) {
			array_push($users, $entry["name"]);
			array_push($newlist, $entry);
		}
	}
	return $newlist;
}

function get_average($mysql) {
	$result = $mysql->query("SELECT ROUND(AVG(points)) AS avg FROM scores;");
	if (!$result) {
		die("Fehler bei der Datenbankabfrage: ".$mysql->error);
	}
	$array = $result->fetch_array();
	return $array["avg"];
}

function get_number($mysql) {
	$result = $mysql->query("SELECT CAST(COUNT(points) AS UNSIGNED) AS x FROM scores;");
	if (!$result){
		die("Fehler bei der Datenbankabfrage: ".$mysql->error);
	}
	$array = $result->fetch_array();
	return $array["x"];
}

function get_last($mysql) {
	$result = $mysql->query("SELECT name, CAST(points AS UNSIGNED) AS points, UNIX_TIMESTAMP(date) AS date FROM scores ORDER BY id DESC LIMIT 1;");
	if (!$result){
		die("Fehler bei der Datenbankabfrage: ".$mysql->error);
	}
	return $result->fetch_assoc();
}

function make_text($list) {
	$l = count($list);
	$text = "";
	
	for ($i = 0; $i < $l; $i += 1) {
		$entry = $list[$i];
		$text .= ($i + 1).". ";
		$text .= $entry["name"].": ";
		$text .= $entry["points"]." ";
		$text .= "(".twitterfy_date($entry["date"]).")\n";
	}
	$text .= "created: ".date("D, d M Y H:i:s");
	
	return $text;
}

function make_xml($list) {
	$xml = "<?xml version='1.0' encoding='utf-8' standalone='yes'?><scores><list>";
	foreach ($list as $entry) {
		$xml .= "<entry gid='".$entry["gid"]."'>";
		$xml .= "<name>".$entry["name"]."</name>";
		$xml .= "<points>".$entry["points"]."</points>";
		$xml .= "<date>".twitterfy_date($entry["date"])."</date>";
		if ($record = $entry["record"]) {
			$xml .= "<record>".$record."</record>";
		}
		$xml .= "</entry>";
	}
	$xml .= "</list></scores>";
	return $xml;
}

function make_csv($list) {
	$csv = "ID;NAME;POINTS;DATE";
	if ($list[0]["record"]) {
		$csv .= ";RECORD";
	}
	$csv .= "\n";
	
	foreach ($list as $entry) {
		$csv .= $entry["gid"].";";
		$csv .= $entry["name"].";";
		$csv .= $entry["points"].";";
		$csv .= date("Y-M-d H:i:s", $entry["date"]);
		if ($record = $entry["record"]) {
			$csv .= ";".$record;
		}
		$csv .= "\n";
	}
	
	return $csv;
}

function lead_zero($x) {
	return ($x > 9) ?$x :"0".$x;
};

function twitterfy_date ($d) {
	$dif_s = time() - (int)$d;
	
	$dif_m = (int)($dif_s/60);
	$dif_h = (int)($dif_m/60);
	$dif_d = (int)($dif_h/24);
	$dif_w = (int)($dif_d/7);
	$dif_y = (int)($dif_w/53);

	if ($dif_s < 60) {
		return "gerade eben";
	}
	else if ($dif_s < 120) {
		return "vor 1 Minute";
	}
	else if ($dif_s < 60*60) {
		return "vor $dif_m Minuten";
	}
	else if ($dif_s < 7200) {
		return "vor 1 Stunde";
	}
	else if ($dif_s < 86400) {
		return "vor $dif_h Stunden";
	}
	else if ($dif_d == 1) {
		return "Gestern";
	}
	else if ($dif_d < 7) {
		return "vor $dif_d Tagen";
	}
	else if ($dif_w < 4) {
		return "vor $dif_w Wochen";
	}
	else {
		return beautify_date($d, False);
	}
}

function beautify_date ($n, $f=False) {
	if (!$f) {
		return date("d.m.y - H:i", (int)$n);
	}
	else {
		return date("r", (int)$n);
	}
}

function get_month_name($month = 0) {
	$data = array("Foo",
	"Januar",
	"Februar",
	"März",
	"April",
	"Mai",
	"Juni",
	"Juli",
	"August",
	"September",
	"Oktober",
	"November",
	"Dezember");
	return $data[$month];
}

function create_list($list) {
	$html = file_get_contents("templates/list.template.html");
	$entry_string = file_get_contents("templates/entry.template.html");
	$entries = "";
	$l = count($list);
	for ($i = 0; $i < $l; $i += 1) {
		$item = $list[$i];
		$entry = str_replace("%rank%", $i + 1, $entry_string);
		$entry = str_replace("%gid%", $item["gid"], $entry);
		$entry = str_replace("%name%", $item["name"], $entry);
		$entry = str_replace("%points%", $item["points"], $entry);
		$entry = str_replace("%date%", twitterfy_date($item["date"]), $entry);
		$entry = str_replace("%exactdate%", beautify_date($item["date"]), $entry);
		$entries .= $entry."\n";
	}
	$html = str_replace("%list%", $entries, $html);
	return $html;
}
	
function create_month_switcher($month = 0, $year = 0) {
	$current_month = (int)date("n");
	$current_year = (int)date("y");
	$month_written;
	
	$html_before;
	$html_current;
	$html_after;
	
	$month_before;
	$year_before;
	
	$month_after;
	$year_after;
	
	/* Keep the current URL (incl. param) when switching to another month */
	$url = "http://unpunk.de/kniffel/list/index.php?";
	foreach ($_GET as $key => $value) {
		if ($key != "get") {
			$url .= $key."=".$value."&";
		}
	}
	
	if ($month == 0) {
		$month = (int)date("n");
	}
	if ($year == 0) {
		$year = (int)date("y");
	}
	$month_written = get_month_name($month);
	
	if ($month == 1) {
		$month_before = 12;
		$year_before = lead_zero($year - 1);
	}
	else {
		$month_before = lead_zero($month - 1);
		$year_before = lead_zero($year);
	}
	
	if ($month == 12) {
		$month_after = "01";
		$year_after = lead_zero($year + 1);
	}
	else {
		$month_after = lead_zero($month + 1);
		$year_after = lead_zero($year);
	}
	
	$html_before = "<span class='before'><a title='Zurück' href='".$url."get=month=$month_before$year_before'>&lt;&lt;</a></span>";
	$html_current = "<span class='current'>$month_written &apos;$year</span>";
	
	if ($month == $current_month && $year == $current_year) {
		$html_after = "<span class='after'>&gt;&gt;</span>";
	}
	else {
		$html_after = "<span class='after'><a title='Vor' href='".$url."get=month=$month_after$year_after'>&gt;&gt;</a></span>";
	}
	
	
	return "<div class='switcher' id='month-switch'>$html_before $html_current $html_after</div>";	
};

function create_best_switcher() {
	/* Keep the current URL (incl. param) when switching to another month */
	$url = "http://unpunk.de/kniffel/list/index.php?";
	foreach ($_GET as $key => $value) {
		if ($key != "best") {
			$url .= $key."=".$value."&";
		}
		else {
			$best = $value;
		}
	}
		
	$class_on = "";
	$class_off = "";
	if ($best == "t") {
		$class_on = "class='best-current'";
	}
	else {
		$class_off = "class='best-current'";
	}
		
	return "<div class='switcher' id='best-switch'><span id='best-on' ".$class_on."><a href='".$url."best=t' title='Zeige nur die Besten Einträge pro Spieler an'>Top Einträge</a></span> <span id='best-off' ".$class_off."><a href='".$url."best=f' title='Zeige alle Einträge pro Spieler an'>Alle Einträge</a></span></div>";
}

?>
