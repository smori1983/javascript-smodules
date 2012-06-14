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
        files: ["test/test.html"]
    },
    concat: {
        all: {
            src: [
                "<banner:meta.banner>",
                "src/smodules/HEAD.js",
                "src/smodules/ui.HEAD.js",
                "src/smodules/ui.*.js",
                "src/smodules/util.HEAD.js",
                "src/smodules/util.*.js",
                "src/smodules/*.js"
            ],
            dest: "dist/smodules-<%= pkg.version %>.js"
        },
        template: {
            src: [
                "<banner:meta.banner>",
                "src/smodules/HEAD.js",
                "src/smodules/templateParser.js",
                "src/smodules/template.js"
            ],
            dest: "dist/smodules.template-<%= pkg.version %>.js"
        }
    },
    min: {
        all: {
            src: [
                "<banner:meta.banner>",
                "dist/smodules-<%= pkg.version %>.js"
            ],
            dest: "dist/smodules-<%= pkg.version %>.min.js"
        },
        template: {
            src: [
                "<banner:meta.banner>",
                "dist/smodules.template-<%= pkg.version %>.js"
            ],
            dest: "dist/smodules.template-<%= pkg.version %>.min.js"
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
            tasks: "lint qunit concat min"
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
            tasks: "lint concat"
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

grunt.registerTask("default", "lint qunit concat min");
grunt.registerTask("test", "lint qunit");

};
