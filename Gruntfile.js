'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.initConfig({

    jsonlint: {
      sample: {
        src: [ 'data/**/*.json' ]
      }
    }

  });

  // Default task.
  grunt.registerTask('default', 'jsonlint');

};
