module.exports = function (grunt) {
	// src-locations
	var src = {
		javascript: {
			kniffel: ["scripts/kniffel.*.js"],
			utils: ["scripts/util.*.js"],
		},
		php: {
			index: ["index.php"],
			list: ["list/index.php", "list/lib_highscore.php", "list/enter.php"],
			feed: ["list/feed/index.php"]
		},
		css: {
			index: ["styles/core.css", "styles/kniffel.*.css", "styles/aside.css"],
			list: ["styles/core.css", "styles/list.*.css", "styles/aside.css"]
		},
		index: {
			index: ["index/index.php", "index/php.ini"],
			templates: ["index/templates/*.template.html", "index/templates/*.template.js", "index/templates/.htaccess", "index/templates/index.php"]
		},
		list: {
			php: ["list/*php"],
			analyse: ["list/analyse/index.html", "list/analyse/analyse.js"],
			feed: ["list/feed/index.php"],
			templates: ["list/templates/*.template.html"],
			visualisation: ["list/visualisation/index.html", "list/visualisation/visualisation.js"]
		},
		config: {
			file: "config/config.php"
		},
		media: {
			pics: ["media/*.png", "media/*.gif"]
		}
		
			
	},
	// tmp-locations
	tmp = {
		javascript: {
			kniffel: "tmp/scripts/kniffel.js",
			utils: "tmp/scripts/utils.js"
		},
		css: {
			index: "tmp/styles/index.css",
			list: "tmp/styles/list.css"
		}
	},
	
	dest = {
		index: "kniffel-v<%= pkg.version %>/",
		list: "kniffel-v<%= pkg.version %>/list/",
		config: "kniffel-v<%= pkg.version %>/",
		media: "kniffel-v<%= pkg.version %>/",		
		javascript: {
			kniffel: "kniffel-v<%= pkg.version %>/scripts/kniffel.min.js",
			utils: "kniffel-v<%= pkg.version %>/scripts/utils.min.js"
		},
		css: {
			index: "kniffel-v<%= pkg.version %>/styles/styles.min.css",
			list: "kniffel-v<%= pkg.version %>/list/styles/styles.min.css"
		},
		index: {
			index: "kniffel-v<%= pkg.version %>/",
			templates: "kniffel-v<%= pkg.version %>/templates/"
		},
		list: {
			php: "kniffel-v<%= pkg.version %>/list/",
			analyse: "kniffel-v<%= pkg.version %>/list/analyse/",
			feed: "kniffel-v<%= pkg.version %>/list/feed/",
			templates: "kniffel-v<%= pkg.version %>/list/templates/",
			visualisation: "kniffel-v<%= pkg.version %>/list/visualisation/"
		},
		config: {
			folder: "kniffel-v<%= pkg.version %>/config/"
		},
		media: {
			folder: "kniffel-v<%= pkg.version %>/media/"
		}
	},
			
	
	config = {
		pkg: grunt.file.readJSON("package.json"),
				
		jshint: {
			utils: {
				src: src.javascript.utils
			},
			kniffel: {
				src: src.javascript.kniffel
			},
			analyse: {
				src: src.javascript.analyse
			}
		},
		
		concat: {
			jsUtils: {
				src: src.javascript.utils,
				dest: tmp.javascript.utils
			},
			jsKniffel: {
				src: src.javascript.kniffel,
				dest: tmp.javascript.kniffel
			},
			jsExtensions: {
				src: src.javascript.extensions,
				dest: tmp.javascript.extensions
			},
			jsAnalyse: {
				src: src.javascript.analyse,
				dest: tmp.javascript.analyse
			},
			cssIndex: {
				src: src.css.index,
				dest: tmp.css.index,
			},
			cssList: {
				src: src.css.list,
				dest: tmp.css.list
			}
		},
		
		phplint: {
			index: src.php.index,
			list: src.php.list,
			feed: src.php.feed
		},
		
		csslint: {
			index: {
				options: {
					ids: false,
					"universal-selector": false,
					"box-model": false,
					"qualified-headings": false
				},					
				src: src.css.index
			},
			list: {
				options: {
					ids: false,
					"universal-selector": false,
					"box-model": false,
					"qualified-headings": false
				},	
				src: src.css.list
			}
		},
		
		uglify: {
			kniffel: {
				src: [tmp.javascript.kniffel],
				dest: dest.javascript.kniffel,
				options: {
					banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n * Author: <%= pkg.author %>\n * License: <%= pkg.license %>\n * */\n"
				}
			},
			utils: {
				src: [tmp.javascript.utils],
				dest: dest.javascript.utils,
				options: {
					banner: "/* Very outdated utils-libary\n * Author: <%= pkg.author %>\n * License: <%= pkg.license %>\n * */\n"
				}
			},
			analyse: {
				src: [tmp.javascript.analyse],
				dest: dest.javascript.analyse,
				options: {
					banner: "/* Some analysing over the highscore entries\n * Author: <%= pkg.author %>\n * License: <%= pkg.license %>\n * */\n"
				}
			}
		},
		
		cssmin: {
			index: {
				src: [tmp.css.index],
				dest: dest.css.index,
			},
			list: {
				src: [tmp.css.list],
				dest: dest.css.list
			}
		},
		
		copy: {
			index: {
				src: src.index.index,
				dest: dest.index.index,
				flatten: true,
				expand: true
			},
			indexTemplates: {
				src: src.index.templates,
				dest: dest.index.templates,
				flatten: true,
				expand: true
			},
			list: {
				src: src.list.php,
				dest: dest.list.php,
				flatten: true,
				expand: true
			},
			listTemplates: {
				src: src.list.templates,
				dest: dest.list.templates,
				flatten: true,
				expand: true
			},
			analyse: {
				src: src.list.analyse,
				dest: dest.list.analyse,
				flatten: true,
				expand: true
			},
			feed: {
				src: src.list.feed,
				dest: dest.list.feed,
				flatten: true,
				expand: true
			},
			visualisation: {
				src: src.list.visualisation,
				dest: dest.list.visualisation,
				flatten: true,
				expand: true
			},
			config: {
				src: src.config.file,
				dest: dest.config.folder,
				flatten: true,
				expand: true
			},
			media: {
				src: src.media.pics,
				dest: dest.media.folder,
				flatten: true,
				expand: true
			}
		}
	};
	
	grunt.initConfig(config);
	
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-phplint");
	grunt.loadNpmTasks("grunt-contrib-csslint");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-copy");
	
	// Linting the parts
	grunt.registerTask("lint-javascript", "Linting Javascript...", ["jshint:utils", "jshint:kniffel"]);
	grunt.registerTask("lint-php", "Linting PHP...", ["phplint:index", "phplint:list", "phplint:feed"]);
	grunt.registerTask("lint-css", "Linting CSS...", ["csslint:index", "csslint:list"]);
	
	// Concating the parts
	grunt.registerTask("concat-javascript", "Concating javascripts...", ["concat:jsUtils", "concat:jsKniffel"]);
	grunt.registerTask("concat-css", "Concating CSS...", ["concat:cssIndex", "concat:cssList"]);
	
	// Copying the parts
	grunt.registerTask("copy-index", "Copying index...", ["copy:index", "copy:indexTemplates"]);
	grunt.registerTask("copy-list", "Copying list...", ["copy:list", "copy:listTemplates", "copy:feed", "copy:analyse", "copy:visualisation"]);
	grunt.registerTask("copy-media", "Copying media...", ["copy:media"]);
	grunt.registerTask("copy-config", "Copying config...", ["copy:config"]);
	
	// Minifying the parts
	grunt.registerTask("minify-javascript", "Minifying javascript...", ["uglify:kniffel", "uglify:utils"]);
	grunt.registerTask("minify-css", "Minifying CSS...", ["cssmin:index", "cssmin:list"]);
	
	// Linting all the parts
	grunt.registerTask("lint-all", "Linting everything...", ["lint-javascript", "lint-php", "lint-css"]);
	
	// Concating all the parts
	grunt.registerTask("concat-all", "Concating everything...", ["concat-javascript", "concat-css"]);
	
	// Minifying all the parts
	grunt.registerTask("minify-all", "Minifying all...", ["minify-javascript", "minify-css"]);
	
	// Copying all the parts
	grunt.registerTask("copy-all", "Copying all...", ["copy-index", "copy-list", "copy-media", "copy-config"]);
	
	// Build the whole thing
	grunt.registerTask("build", "Building Kniffel-Maschine...", ["lint-all", "concat-all", "minify-all", "copy-all"]);
	
};
