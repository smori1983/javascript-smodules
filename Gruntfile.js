module.exports = function(grunt) {

grunt.initConfig({
  pkg: "<json:package.json>",
  meta: {
    banner: "/*!\n" +
            " * <%= pkg.name %> v<%= pkg.version %>\n" +
            " *\n" +
            " * Copyright (c) <%= grunt.template.today('yyyy') %> smori <shinichiro.mori.19833@gmail.com>\n" +
            " * Dual licensed under the MIT or GPL-2.0 licenses.\n" +
            " *\n" +
            " * Date <%= grunt.template.today('yyyy-mm-dd HH:MM:ss') %>\n" +
            " */"
  },
  eslint: {
    target: ["Gruntfile.js", "src/smodules/*.js", "test/smodules/*.js"]
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
  }
});

grunt.loadNpmTasks("grunt-contrib-concat");
grunt.loadNpmTasks('grunt-eslint');

grunt.registerTask("default", ["eslint", "concat"]);
grunt.registerTask("lint", ["eslint"]);

};
