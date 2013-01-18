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
};

function check_get ($get) {
	return (bool)preg_match("/^def|all|month=\d+|name=\w+|days=\d+|last=\d+$/", $get);
};

function check_number ($number) {
	return (is_numeric($number) || ($number == "all"));
};

function check_format ($format) {
	return ($format == "html" || $format == "json" || $format == "text");
};

function check_best ($best) {
	return ($best == "t" || $best == "f");
};

function checkName($name) {
	$l = count($name);
	if ($l > 0 && $l <= 8 && preg_match("/^[\wäöüÄÖÜ]+$/", $name)) {
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

function lead_zero($x) {
	return ($x > 9) ?$x :"0".$x;
};

function sync_the_feed($name, $points, $date, $gid) {
	$feed = simplexml_load_file("feed.xml");
	$item = $feed->channel->addChild("item");
	$item->addChild("title", "$name: $points");
	$item->addChild("description", "Neuer Eintrag von $name am ".date("d.m.y H:i", (int)$date)." mit $points Punkten");
	$item->addChild("link", "http://www.unpunk.de/kniffel/?gid=$gid");
	$item->addChild("author", "kniffel@unpunk.de");
	$guid = $item->addChild("guid", "http://www.unpunk.de/kniffel/?gid=$gid");
	$guid->addAttribute("isPermaLink", "true");
	$item->addChild("pubDate", date("r", (int)$date));
	$feed->channel->pubDate[0] = date("r", time());
	$feed->asXML("feed.xml");
};

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
	
	if ($month == 0) {
		$month = (int)date("n");
	}
	if ($year == 0) {
		$year = (int)date("y");
	}
	$month_written = what_month($month);
	
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
	
	$html_before = "<span class='before'><a title='Zurück' href='./?get=month=$month_before$year_before'>&lt;&lt;</a></span>";
	$html_current = "<span class='current'>$month_written &apos;$year</span>";
	
	if ($month == $current_month && $year == $current_year) {
		$html_after = "<span class='after'>&gt;&gt;</span>";
	}
	else {
		$html_after = "<span class='after'><a title='Vor' href='./?get=month=$month_after$year_after'>&gt;&gt;</a></span>";
	}
	
	
	return "<div class='switcher'>$html_before $html_current $html_after</div>";	
};

function what_month($month = 0) {
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
};
	

?>
