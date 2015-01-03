'use strict';

module.exports = function (grunt) {

  // Load npm tasks.
  [
    'grunt-contrib-jshint',
    'grunt-jscs',
    'grunt-contrib-jasmine'
  ].forEach(function (name) {
    grunt.loadNpmTasks(name);
  });

  var config = {
    javascripts: ['*.js', 'test/**/*.js']
  };

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: config.javascripts
    },

    jscs: {
      all: config.javascripts
    },

    jasmine: {
      all: {
        src: [
          'testmator.js',
          'test/helpers/**/*.js'
        ],
        options: {
          specs: 'test/spec/{,*/}*.js',
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/underscore/underscore.js',
            'bower_components/backbone/backbone.js',
            'bower_components/bootstrap/dist/js/bootstrap.js'
          ]
        }
      }
    }
  });

  // Validate javascript.
  grunt.registerTask('jscheck', ['jshint', 'jscs']);

  // Running jasmine test.
  grunt.registerTask('test', ['jasmine']);

  grunt.registerTask('fulltest', ['jscheck', 'test']);
  grunt.registerTask('default', ['fulltest']);
};
