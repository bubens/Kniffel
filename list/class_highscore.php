<?php
class HighscoreDB {
	
	public function __construct($filename) {
		$this->filename = $filename;
		$this->init_time = microtime(True);
		$this->document = simplexml_load_file($this->filename);
		$this->raw_entries = $this->make_entries();
		$this->combed_entries =  $this->make_entries();
	}
	
	# to be revised
	private $filename;
	
	private $document;
	
	private $raw_entries;
	
	private $combed_entries;
	
	private $init_time;
	
	private function save() {
		$this->document->asXML($this->filename);
		$this->entries = $this->make_entries();
	 }
	 
	public function average () {
		 $copy = $this->combed_entries;
		 $l = count($copy);
		 if ($l == 0) {
			 return 0;
		 }
		 $x = 0;
		 for ($i=0; $i<$l; $i+=1) {
			 $x += $copy[$i]["points"];
		 }
		 return (int)($x/$l);
	 }
	
	static function sort_by_date($a, $b) {
		$c1 = (int)$a["date"];
		$c2 = (int)$b["date"];
		return ($c1 == $c2) ?0 :($c1 < $c2) ?1 :-1;
	}
	
	static function sort_by_points($a, $b) {
		$c1 = (int)$a["points"];
		$c2 = (int)$b["points"];
		return ($c1 == $c2) ?0 :($c1 < $c2) ?1 :-1;
	}
	
	static function twitterfy_date ($d) {
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
		else if ($dif_w < 53) {
			return "vor $dif_w Wochen";
		}
		else {
			return HighscoreDB::beautify_date($d, False);
		};
	}
		
	static function beautify_date ($n, $f) {
		if (!$f) {
			return date("d.m.y - H:i", (int)$n);
		}
		else {
			return date("r", (int)$n);
		};
	}
	
	public function strip_record() {
		$copy = $this->combed_entries;
		$tmp = array();
		$l = count($copy);
		for ($i=0; $i<$l; $i+=1) {
			$entry = array();
			$entry["name"] = $copy[$i]["name"];
			$entry["date"] = $copy[$i]["date"];
			$entry["gid"] = $copy[$i]["gid"];
			$entry["points"] = $copy[$i]["points"];
			array_push($tmp, $entry);
		};
		$this->combed_entries = $tmp;
	}
	
	private function make_entries() {
		$list = array();
		foreach ($this->document->list->children() as $entry) {
			$tmp = array();
			foreach ($entry->children() as $key => $value) {
				if ($key == "points" || $key == "date") {
					$tmp[$key] = (int)$value;
				}
				else {
					$tmp[$key] = (string)$value;
				};
				if (isset($entry->attributes()->gid)) {
					$tmp["gid"] = (string)$entry->attributes()->gid[0];
				};
			};
			array_push($list, $tmp);
		};
		return $list;
	}
	
	public function last_entries ($n, $sort) {
		$copy = $this->raw_entries;
		usort($copy, array($this, "sort_by_date"));
		#$this->combed_entries = array_slice($copy, 0, $n);
		$copy = array_slice($copy, 0, $n);
		if ($sort) {
			usort($copy, array($this, "sort_by_points"));
		};
		$this->combed_entries = $copy;
	}
	
	public function top_entries ($n) {
		$copy = $this->combed_entries;
		usort($copy, array($this, "sort_by_points"));
		$this->combed_entries = array_slice($copy, 0, $n);
	}
	
	public function best_entries () {
		$copy = $this->combed_entries;
		$tmp = array();
		$example = "";
		$l = count($copy);
		for ($i=0; $i<$l; $i+=1) {
			if (preg_match("/\b".$copy[$i]["name"]."\b/i", $example) == 0) {
				array_push($tmp, $copy[$i]);
				$example = $example." ".$copy[$i]["name"];
				};
			};
			usort($tmp, array($this, "sort_by_points"));
		$this->combed_entries = $tmp;
	}
	
	public function entries_by_month ($month, $year) {
		$copy = $this->combed_entries;
		$l = count($copy);
		$tmp = array();
		for ($i=0; $i<$l; $i+=1) {
			$m = date("n", $copy[$i]["date"]);
			$y = date("y", $copy[$i]["date"]);
			if ($m == $month && $y == $year) {
				array_push($tmp, $copy[$i]);
			}
		}
		usort($tmp, array($this, "sort_by_points"));
		$this->combed_entries = $tmp;
	}
	
	public function entries_this_month () {
		$month = date("n");
		$year = date("y");
		$this->entries_by_month($month, $year);
	}
	
	public function entries_by_name ($name) {
		$copy = $this->combed_entries;
		$tmp = array();
		foreach ($copy as $entry) {
			if ($entry["name"] == $name) {
				array_push($tmp, $entry);
			}
		}
		usort($tmp, array($this, "sort_by_points"));
		$this->combed_entries = $tmp;
	}
	
	public function entries_by_daysgoneby ($n) {
		$copy = $this->combed_entries;
		$seconds = $n * 24 * 60 * 60;
		$now = time();
		$then = $now - $seconds;
		$tmp = array();
		$l = count($copy);
		for ($i=0; $i<$l; $i+=1) {
			if ($copy[$i]["date"] >= $then) {
				array_push($tmp, $copy[$i]);
			}
		}
		usort($tmp, array($this, "sort_by_points"));
		$this->combed_entries = $tmp;
	}
	
	//no questions asked. do your security stuff by yourself!!!
	public function add_entry($name, $points, $date, $record, $gid) {
		$entry = $this->document->list->addChild("entry");
		$entry->addAttribute("gid", $gid);
		$entry->addChild("name", $name);
		$entry->addChild("points", $points);
		$entry->addChild("date", $date);
		$entry->addChild("record", $record);
		$this->save();
		return True;
	}
	
	public function dump () {
		return $this->combed_entries;
	}
	
	public function dump_as_json ($record = False) {
		$tmp = array();
		if (!$record) {
			$this->strip_record();
		}
		$tmp["list"] = $this->combed_entries;
		$tmp["averagePoints"] = $this->average();
		$tmp["lastEntry"] = $this->get_last_entries(1, False);
		$tmp["time"] = microtime(True) - $this->init_time;
		return json_encode($tmp);
	}
	
	public function dump_as_text () {
		$copy = $this->combed_entries;
		$tmp = "";
		$len = count($copy);
		for ($i=0; $i<$len; $i++) {
			$date = $this->twitterfy_date($copy[$i]["date"]);
			$tmp = $tmp.($i+1).". ".$copy[$i]["name"].": ".$copy[$i]["points"]." (".$date.")\n";
		};
		$tmp = $tmp."(Stand: ".$this->beautify_date(time(), false).")\n";
		#$tmp = $tmp."created in ".(microtime(True)-$this->init_time)."s";
		return $tmp;
	}
	
	public function dump_as_html () {
		$copy = $this->combed_entries;
		#var_dump($copy);
		#$html = "<ol id='list_highscore'>";
		$html = "<table id=\"list_highscore\">";
		$html = $html."\n\t<thead><tr class=\"list_header\"><th>Rank</th><th>Name</th><th>Points</th><th>Date</th></tr></thead><tbody>";
		$l = count($copy);
		for ($i=0; $i<$l; $i+=1) {
			$rank = $i+1;
			$name = $copy[$i]["name"];
			$points = $copy[$i]["points"];
			$gid = $copy[$i]["gid"];
			$index = $i+1;
			$date = $this->twitterfy_date($copy[$i]["date"]);
			#$html = $html."\n\t<li class='list_entry'>\n\t\t<span class='list_name'><a href=\"http://localhost/kniffel/?gid=$gid\">$name</a></span>\n\t\t<span class='list_points'>$points</span>\n\t\t<span class='list_date'>($date)</span>\n\t</li>";
			$html = $html."\n\t<tr class=\"list_entry\"><td class=\"list_index\">$index</td><td class=\"list_name\"><a href=\"http://unpunk.de/kniffel/?gid=$gid\">$name</a></td><td class=\"list_points\">$points</td><td class=\"list_date\">($date)</td></tr>";
		}
		#$html = $html."\n</ol>";
		$html = $html."\n</tbody></table>";
		return $html;
	}
	
	public function get_entry_by_gid ($gid) {
		$copy = $this->raw_entries;
		$l = count($copy);
		for ($i=0; $i<$l; $i+=1) {
			if (isset($copy[$i]["gid"]) && $copy[$i]["gid"] == $gid) {
				return $copy[$i];
			};
		};
		return FALSE;
	}
			
	
	public function get_entries_by_name ($name) {
		$a = new HighscoreDB($this->filename);
		$a->entries_by_name($name);
		return $a->dump();
	}
	
	public function get_best_entry_by_name ($name) {
		$list = $this->get_entries_by_name($name);
		usort($list, array($this, "sort_by_points"));
		return $list[0];
	}
	
	public function get_last_entry_by_name ($name) {
		$list = $this->get_entries_by_name($name);
		usort($list, array($this, "sort_by_date"));
		return $list[0];
	}

	public function get_last_entries ($n, $record = True) {
		$a = new HighscoreDB($this->filename);
		$a->last_entries($n, False);
		if (!$record) {
			$a->strip_record();
		}
		return $a->dump();
	}
}
?>
