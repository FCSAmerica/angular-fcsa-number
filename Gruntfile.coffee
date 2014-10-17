module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      options:
        bare: false
      compile:
        files:
          'src/fcsaNumber.js': 'src/fcsaNumber.coffee'
          'test/fcsaNumber.spec.js': 'test/fcsaNumber.spec.coffee'
          'test/fcsaNumberConfig.spec.js': 'test/fcsaNumberConfig.spec.coffee'
          'e2e/fcsaNumber.e2e.js': 'e2e/fcsaNumber.e2e.coffee'
    pkg: grunt.file.readJSON('package.json')
    uglify:
      options:
        banner: '/*! <%= pkg.name %> (version <%= pkg.version %>) <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      build:
        src: 'src/fcsaNumber.js'
        dest: 'src/fcsaNumber.min.js'
    file_append:
      default_options:
        files:
          'src/fcsaNumber.js':
            prepend: '/*! <%= pkg.name %> (version <%= pkg.version %>) <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    copy:
      web_angular:
        src: 'bower_components/angular/angular.js'
        dest: 'e2e/web/public/angular.js'
      web_fcsaNumber:
        src: 'src/fcsaNumber.js'
        dest: 'e2e/web/public/fcsaNumber.js'
    express:
      dev:
        options:
          script: 'e2e/web/app.js'
          nospawn: true
          delay: 5
    shell:
      protractor:
        options:
          stdout: true
        command: 'protractor e2e/protractor.config'
    watch:
      files: [
        'src/fcsaNumber.coffee'
        'test/fcsaNumber.spec.coffee'
        'test/fcsaNumberConfig.spec.coffee'
        'e2e/fcsaNumber.e2e.coffee'
      ]
      tasks: 'default'
      karma:
        files: [
          'src/fcsaNumber.js'
          'test/fcsaNumber.spec.js'
          'test/fcsaNumberConfig.spec.js'
        ]
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

  grunt.registerTask 'default', ['coffee', 'uglify', 'file_append', 'copy:web_angular', 'copy:web_fcsaNumber']
  grunt.registerTask 'e2e', ['default', 'express', 'shell:protractor']
