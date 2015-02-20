module.exports = function (grunt) {
	// src-locations
	var src = require("./Gruntfiles/files.src.js"),
	// tmp-locations
	tmp = require("./Gruntfiles/files.tmp.js"),
	//
	dest = require("./Gruntfiles/files.dest.js"),
	
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
		
		concat: {
			options: {
				stripBanners: true
			},
			javascript: {
				files: [{
					src: src.javascript.utils,
					dest: tmp.javascript.utils
				},
				{
					src: src.javascript.kniffel,
					dest: tmp.javascript.kniffel
				}
			]},
			css: {
				files: [{
					src: src.css.index,
					dest: tmp.css.index,
				},
				{
					src: src.css.list,
					dest: tmp.css.list
				}
			]}
		},
		
		
		
		uglify: {
			kniffel: {
				files: [{
					expand: true,
					src: [tmp.javascript.kniffel],
					dest: dest.javascript.kniffel,
					ext: ".min.js",
					extDot: "first",
					flatten: true
				}],
				options: {
					banner: "/* <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n * Author: <%= pkg.author %>\n * License: <%= pkg.license %>\n * */\n"
				}
			},
			utils: {
				files: [{
					expand: true,
					src: [tmp.javascript.utils],
					dest: dest.javascript.utils,
					ext: ".min.js",
					extDot: "first",
					flatten: true
				}],
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
			css: {
				options: {
					banner: "/* I hate CSS. CSS is designer-bullshit... or I'm just too stupid... you decide! */\n"
				},
				files: [{
					expand: true,
					src: [tmp.css.index],
					dest: dest.css.index,
					flatten: true,
					ext: ".min.css",
					extDot: "first"
				},
				{
					expand: true,
					src: [tmp.css.list],
					dest: dest.css.list,
					flatten: true,
					ext: ".min.css",
					extDot: "first"
				}
			]}
		},
		
		copy: {
			options: {
				flatten: true,
				expand: true
			},
			javascript: {
				files: [{
					expand: true,
					src: tmp.javascript.kniffel,
					dest: dest.javascript.kniffel,
					ext: ".min.js",
					extDot: "first",
					flatten: true
				},
				{
					expand: true, 
					src: tmp.javascript.utils,
					dest: dest.javascript.utils,
					// for compatibility with non-dev-/minified version
					ext: ".min.js",
					extDot: "first",
					flatten: true
				}
			]},
			css: {
				files: [{
					expand: true,
					src: tmp.css.index,
					dest: dest.css.index,
					// for compatibility with non-dev-/minified version
					ext: ".min.css",
					extDot: "first",
					flatten: true,
				},
				{
					expand: true,
					src: tmp.css.list,
					dest: dest.css.list,
					ext: ".min.css",
					extDot: "first",
					flatten: true,
				}]
			},
			index: {
				files: [{
					src: src.views.index.php,
					dest: dest.index.index,
					flatten: true,
					expand: true
				},
				{
					src: src.views.index.templates,
					dest: dest.index.templates,
					flatten: true,
					expand: true
				}
			]},
			list: {
				files: [{
					src: src.views.list.php,
					dest: dest.list.php,
					flatten: true,
					expand: true
				},
				{
					src: src.views.list.templates,
					dest: dest.list.templates,
					flatten: true,
					expand: true
				}
			]},
			analyse: {
				src: src.views.analyse,
				dest: dest.list.analyse,
				flatten: true,
				expand: true
			},
			visualisation: {
				src: src.views.visualisation,
				dest: dest.list.visualisation,
				flatten: true,
				expand: true
			},
			feed: {
				src: src.feed.file,
				dest: dest.list.feed,
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
		},
		
		clean: {
			tmp: {
				src: ["tmp/"]
			}
		},
		
		"ftp-deploy": {
			test: {
				auth: {
					host: "planspielpopband.de",
					port: 21,
					authKey: "standard"
				},
				src: "kniffel-v<%= pkg.version %>/",
				dest: "/unpunk/xkniffel",
				exclusions: ["config"]
			},
			release: {
				auth: {
					host: "planspielpopband.de",
					port: 21,
					authKey: "standard"
				},
				src: "kniffel-v<%= pkg.version %>/",
				dest: "/unpunk/kniffel",
				exclusions: ["config"]
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
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-ftp-deploy");
	
	// Linting the parts
	grunt.registerTask("lint-javascript", "Linting Javascript...", ["jshint:utils", "jshint:kniffel"]);
	grunt.registerTask("lint-php", "Linting PHP...", ["phplint:index", "phplint:list", "phplint:feed"]);
	grunt.registerTask("lint-css", "Linting CSS...", ["csslint:index", "csslint:list"]);
	
	// Concating the parts
	grunt.registerTask("concat-javascript", "Concating javascripts...", ["concat:javascript"]);
	grunt.registerTask("concat-css", "Concating CSS...", ["concat:css"]);
	
	// Copying the parts
	grunt.registerTask("copy-index", "Copying index...", ["copy:index"]);
	grunt.registerTask("copy-list", "Copying list...", ["copy:list", "copy:feed", "copy:analyse", "copy:visualisation"]);
	grunt.registerTask("copy-media", "Copying media...", ["copy:media"]);
	grunt.registerTask("copy-config", "Copying config...", ["copy:config"]);
	grunt.registerTask("copy-javascript", "Copying javascript (without minifying)...", ["copy:javascript"]);
	grunt.registerTask("copy-css", "Copying css (without minifying)...", ["copy:css"]);
	
	// Minifying the parts
	grunt.registerTask("minify-javascript", "Minifying javascript...", ["uglify:kniffel", "uglify:utils"]);
	grunt.registerTask("minify-css", "Minifying CSS...", ["cssmin:css"]);
	
	// Linting all the parts
	grunt.registerTask("lint-all", "Linting everything...", ["lint-javascript", "lint-php", "lint-css"]);
	
	// Concating all the parts
	grunt.registerTask("concat-all", "Concating everything...", ["concat-javascript", "concat-css"]);
	
	// Minifying all the parts
	grunt.registerTask("minify-all", "Minifying all...", ["minify-javascript", "minify-css"]);
	
	// Copying all the parts
	grunt.registerTask("copy-all", "Copying all...", ["copy-index", "copy-list", "copy-media", "copy-config"]);
	grunt.registerTask("copy-all-dev", "Copy all (incl. js/css)", ["copy-all", "copy-javascript", "copy-css"]);
	
	// Delete tmp-folder
	grunt.registerTask("clean-tmp", "Deleting tmp/ folder...", ["clean:tmp"]);
	
	// Build the whole thing
	grunt.registerTask("build", "Building Kniffel-Maschine...", ["lint-all", "concat-all", "minify-all", "copy-all", "clean-tmp"]);
	grunt.registerTask("build-dev", "Building Dev-version of Kniffel-Maschine...", ["lint-all", "concat-all", "copy-all-dev", "clean-tmp"]);
	
	grunt.registerTask("test-deploy", "Deploy for testing...", ["ftp-deploy:test"]);
	grunt.registerTask("release", "Deploy release...", ["ftp-deploy:release"]);
	
};
