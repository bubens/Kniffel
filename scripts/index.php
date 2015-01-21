<?php
//include ("vendor/autoload.php");
include "../jshrink/minifier.php";

$scripts = array(
	"kniffel_js" => ["kniffel.misc.js", "kniffel.list.js", "kniffel.prompt.js", "kniffel.comment.js", "kniffel.dice.js", "kniffel.entry.js", "kniffel.core.js"],
	"util_js" => ["util.misc.js", "util.ajax.js", "util.element.js", "util.event.js", "util.interval.js", "util.json.js", "util.keks.js", "util.location.js", "util.time.js"],
	"extensions_js" => ["extensions.js"],
	"analyse_js" => ["analyse.js"]
);


function find_files($query, $scripts) {
	if (preg_match("/^[a-z]+\_js$/", $query, $foo) > 0) {
	
		$files = $scripts[$query];
			
		if (isset($files)) {
				
			return $files;
		
		}
		else {
				
			$code = "{'success':false,'error':'Coffee too hot, burned my lips.'}";
			
		}
	
	}
	else {
		
		$code = "{'success':false,'error':'All my bases are belong to them.'}";
		
	}
	
	return $code;
}

function gather_files($files) {
	$l = count($files);
	$code = "";
	
	for ($i = 0; $i < $l; $i++) {
		$path = $files[$i];
		
		if (file_exists($path)) {
			
			$code = $code."\n".file_get_contents($path);
			
		}
		else {
			
			return "{'success':false,'error':'Brain punctured while picking nose at $i ($path).'}";
			
		}
	}
	return $code;
}


$query = key($_GET);
$debug = $_GET[$query];


$files = find_files($query, $scripts);


if (gettype($files) == "string") {
	$code = $files;
}
else if (gettype($files) == "array") {
	$code = gather_files($files);
}
else {
	var_dump($code);
}


if (isset($debug) && $debug == "dev") {
	$minified = $code;
}
else {
	$minified = Minifier::minify($code);
}

$gzipped = gzencode($minified);

header('Content-Encoding: gzip');
header('Content-Length: '.strlen($gzipped));
header("Content-Type: text/javascript");

echo $gzipped;
	
?>
