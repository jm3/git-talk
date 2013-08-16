module.exports = function (grunt) {
    'use strict';

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        src  : '.'
      , dist : 'deploy'
      , srv  : 'build'
    };

    var deployConfig = grunt.file.readJSON('js/deploy.json');

    grunt.initConfig({
        yeoman: yeomanConfig

        // web server config
      , connect: {
          options: {
              port: 4567
            , hostname: '0.0.0.0'
          }
        , livereload: {
              options: {
                  middleware: function (connect) {
                      return [
                          require('grunt-contrib-livereload/lib/utils').livereloadSnippet
                        , connect.static(require('path').resolve(yeomanConfig.srv))
                        , connect.static(require('path').resolve(yeomanConfig.src))
                      ];
                  }
              }
          }
        , build: {
              options: {
                  middleware: function (connect) {
                      return [
                          connect.static(require('path').resolve(yeomanConfig.dist))
                      ];
                  }
                , keepalive : true
              }
          }
      }

        // watch files and trigger recompilation/livereload
      , watch: {

        // watch jade files, compile them to .tmp
        jade: {
            files: ['text/*.jade']
          , tasks: ['jade']
        }

          // watch (compiled) files in .tmp, and (normal) files in app, and livereload that ish
        , livereload: {
            files: ['index.html']
          , tasks: ['livereload']
        }
      }

      , clean: {
          build: {
              files: [{
                  dot: true,
                  src: [
                      '<%= yeoman.srv %>'
                    , '<%= yeoman.dist %>/**/*'
                    , '!<%= yeoman.dist %>/.git*'
                  ]
              }]
          }
        , development: '<%= yeoman.srv %>'
      }

        // Compile .jade -> .html
       // https://gist.github.com/kevva/5201657
      , jade: {
          build : {
              options: {
                  pretty: true
              },
              files: [{
                  expand: true
                , cwd  : 'text/'
                , dest : '<%= yeoman.srv %>/' // '/Volumes/s3.jm3/public.jm3.net/git-talk/'
                , src  : ['*.jade']
                , ext  : '.html'
              },{
                  expand: true
                , cwd  : '<%= yeoman.src %>/javascripts/directives/templates'
                , dest : '<%= yeoman.srv %>/templates'
                , src  : '**/*.jade'
                , ext  : '.html'
              }]
          }
      }

      , copy: {
          build:{
              files : [{
                  expand : true
                , src  : '{,views/**/}*.html'
                , cwd  : '<%= yeoman.src %>'
                , dest : '<%= yeoman.srv %>'
              },{
                  expand : true
                , src  : '{stylesheets,vendor}/**/*.css'
                , cwd  : '<%= yeoman.src %>'
                , dest : '<%= yeoman.srv %>'
              },{
                  expand : true
                , src  : '**/*.js'
                , cwd  : '<%= yeoman.src %>/vendor'
                , dest : '<%= yeoman.srv %>/vendor'
              },{
                  expand : true
                , src  : '**/*.html'
                , cwd  : '<%= yeoman.src %>/javascripts/directives/templates'
                , dest : '<%= yeoman.srv %>/templates'
              },{
                  src  : '<%= yeoman.src %>/javascripts/config/local.dist.js'
                , dest : '<%= yeoman.srv %>/javascripts/config/local.js'
              }]
          }
        , deploy: {
            files: [{
                expand : true
              , src : '*.html'
              , cwd : '<%= yeoman.srv %>'
              , dest : '<%= yeoman.dist %>'
            },{
                expand: true
              , dot: true
              , src: [
                  '.htaccess'
                , '**/*.{gif,webp,ico,json,woff,ttf,eot,svg,swf}'
              ]
              , cwd: '<%= yeoman.src %>'
              , dest: '<%= yeoman.dist %>'
            },{
                expand: true
              , dot: true
              , cwd: '<%= yeoman.src %>/vendor/font-awesome/font'
              , src: '**/*.{woff,ttf,eot,svg}'
              , dest: '<%= yeoman.dist %>/font'
            }]
        }
      }

        // deploy to s3
      , deploy_config : deployConfig
      , aws_s3: {
          options: {
              // make sure to set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY in your shell
              access      : 'public-read'
            , region      : 'us-east-1'
            , concurrency : 5
          }
        , canary : {
              options: {
                  bucket : '<%= deploy_config.buckets.canary %>'
              }
            , files : [{
                expand : true
              , cwd    : '<%= yeoman.dist %>'
              , src    : '**/*'
              , dest   : '' // inserting a '/' here causes double slashes in the S3 path, which breaks s3
            }]
          }
        , production: {
              options: {
                  bucket : '<%= deploy_config.buckets.production %>'
              }
            , files : [{
                expand : true
              , cwd    : '<%= yeoman.dist %>'
              , src    : '**/*'
              , dest   : ''
            }]
          }
      }

    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('deploy:production',['aws_s3:production']);
    grunt.registerTask('deploy');

    grunt.registerTask('server', [
        'clean:development'
      , 'jade'
      , 'livereload-start'
      , 'connect:livereload'
      , 'watch'
    ]);

    grunt.registerTask('server:build', [
        'connect:build'
    ]);

    grunt.registerTask('_prebuild', [
        'clean:build'
      , 'jade'          // compile jade -> html
      , 'copy:build'    // copy any other build-required resources over
    ]);

    grunt.registerTask('build:production',[
        '_prebuild'
      , 'requirejs:production' // concat JS in dependency order
      , '_postbuild'
    ]);

    grunt.registerTask('_postbuild', [
      , 'rev'         // revision stamp everything for far-future clientside caching
      , 'copy:deploy'
    ]);

    grunt.registerTask('build');
    grunt.registerTask('default', ['server']);
};
