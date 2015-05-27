module.exports = {
	// All js-sources for linting, concating and minifying
	javascript: {
		// start with explicit identifier to make sure that this is the first file in concating
		kniffel: ["scripts/kniffel.entry.js", "scripts/kniffel.misc.js","scripts/kniffel.list.js", "scripts/kniffel.prompt.js", "scripts/kniffel.dice.js", "scripts/kniffel.comment.js", "scripts/kniffel.core.js"],
		utils: ["scripts/util.misc.js", "scripts/util.*.js"],
	},
	// All php-sources for linting
	php: {
		index: ["views/index/index.php"],
		list: ["views/list/index.php", "views/list/lib_highscore.php", "views/list/enter.php"],
		feed: ["feed/index.php"]
	},
	// All css-sources for linting and building
	css: {
		index: ["styles/core.css", "styles/kniffel.*.css", "styles/aside.css"],
		list: ["styles/core.css", "styles/list.*.css", "styles/aside.css"]
	},
	// All the views and their dependecies (excl. js and css - will be seperatly)
	views: {
		index: {
			php: ["views/index/index.php", "views/index/php.ini"],
			templates: ["views/index/templates/*.template.html", "views/index/templates/*.template.js", "views/index/templates/.htaccess", "views/index/templates/index.php"]
		},
		list: {
			php: ["views/list/*php", "views/list/php.ini"],
			templates: ["views/list/templates/*.template.html"],
		},
		analyse: ["views/analyse/index.html", "views/analyse/analyse.js"],
		visualisation: ["views/visualisation/index.html", "views/visualisation/visualisation.js"]
	},
	feed: {
		file: ["feed/index.php"],
	},
	config: {
		file: ["config/config.php"]
	},
	media: {
		pics: ["media/*.png", "media/*.gif"]
	},
	docs: {
		api: ["api-docs.md"]
	}		
};
