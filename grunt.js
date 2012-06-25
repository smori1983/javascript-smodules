module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
    pkg: "<json:package.json>",
    meta: {
        banner: "/*!\n" +
                " * <%= pkg.name %> v<%= pkg.version %>\n" +
                " *\n" +
                " * Copyright (c) <%= grunt.template.today('yyyy') %> smori <smori1983@gmail.com>\n" +
                " * Dual licensed under the MIT or GPL-2.0 licenses.\n" +
                " *\n" +
                " * Date <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
                " */"
    },
    lint: {
        all: ["grunt.js", "src/smodules/*.js", "test/smodules/*.js"]
    },
    qunit: {
        files: ["test/test.html", "test/test.*.html"]
    },
    concat: {
        all: {
            src: [
                "<banner:meta.banner>",
                "src/smodules/HEAD.js",
                "src/smodules/a.js",
                "src/smodules/data.HEAD.js",
                "src/smodules/data.*.js",
                "src/smodules/mod.HEAD.js",
                "src/smodules/mod.*.js",
                "src/smodules/ui.HEAD.js",
                "src/smodules/ui.*.js",
                "src/smodules/util.HEAD.js",
                "src/smodules/util.*.js",
                "src/smodules/*.js"
            ],
            dest: "dist/smodules-<%= pkg.version %>.js"
        }
    },
    min: {
        all: {
            src: [
                "<banner:meta.banner>",
                "<config:concat.all.dest>"
            ],
            dest: "dist/smodules-<%= pkg.version %>.min.js"
        }
    },
    jshint: {
        options: {
            browser: true,
            curly: true,
            //eqeqeq: true,
            forin: true
        }
    },
    watch: {
        all: {
            files: [
                "src/smodules/*.js",
                "test/smodules/*.js"
            ],
            tasks: "lint qunit preconcat concat min"
        },
        test: {
            files: [
                "src/smodules/*.js",
                "test/smodules/*.js"
            ],
            tasks: "lint qunit"
        },
        concat: {
            files: [
                "src/smodules/*.js",
                "test/smodules/*.js"
            ],
            tasks: "lint preconcat concat"
        },
        lint: {
            files: [
                "src/smodules/*.js",
                "test/smodules/*.js"
            ],
            tasks: "lint"
        }
    }
});

grunt.registerTask("preconcat", "preconcat", function() {
    var fs    = require("fs"),
        path  = require("path"),
        dir   = path.resolve("dist"),
        count = 0;

    fs.readdirSync(dir).forEach(function(file) {
        if (/\.js$/.test(file)) {
            fs.unlinkSync(path.resolve(dir, file));
            count++;
        }
    });

    grunt.log.writeln("Removed file count: " + count);
});

grunt.registerTask("default", "lint qunit preconcat concat min");
grunt.registerTask("test", "lint qunit");

};
