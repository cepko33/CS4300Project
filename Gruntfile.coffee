module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compile:
        files:
          'public/main.js': 'public/main.coffee'
          'web.js': 'web.coffee'
    browserSync:
      dev:
        bsFiles:
          src: '**/*.js'
        options:
          open: 'local'
          watchTask: true
    watch:
      files: ['**/*.coffee']
      tasks: ['coffee']
    express:
      dev:
        options:
          script: 'web.js'
          port: 5000

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-browser-sync'
  grunt.registerTask 'default', ['coffee', 'browserSync', 'express:dev', 'watch']
