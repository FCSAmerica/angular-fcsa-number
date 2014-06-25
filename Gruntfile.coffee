module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      options:
        bare: false
      compile:
        files:
          'src/fcsaNumber.js': 'src/fcsaNumber.coffee'
          'test/fcsaNumber.spec.js': 'test/fcsaNumber.spec.coffee'
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/*! <%= pkg.name %> (version <%= pkg.version %>) <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'src/fcsaNumber.js'
        dest: 'src/fcsaNumber.min.js'
    watch:
      files: [
        'src/fcsaNumber.coffee'
        'test/fcsaNumber.spec.coffee'
      ]
      tasks: 'default'
      karma:
        files: ['src/fcsaNumber.js', 'test/fcsaNumber.spec.js']
        tasks: ['karma:unit:run']
    karma:
      unit:
        configFile: 'karma.conf.js'
        background: true
      continuous:
        configFile: 'karma.conf.js'
        singleRun: true
        browsers: ['PhantomJS']


  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'default', ['coffee', 'uglify']
