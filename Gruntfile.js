module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var browsers = require('./grunt/browsers');

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['node_modules/babel-polyfill/dist/polyfill.js', 'dist/scxml.js'],
          dest: 'dist/scxml.js'
        },
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'dist/scxml.js',
          dest: 'dist/scxml.min.js'
        }
      },
      babel: {
          options: {
              sourceMap: true,
              presets: ['es2015'],
              plugins : ['transform-es2015-modules-umd']
          },
          dist: {
              files: {
                  'dist/scxml.js' : 'dist/scxml.js'
              }
          }
      },
      nodeunit: {
        platform : ['test/platform-tests/node/*/runner.js']
      },
      karma: require('./grunt/config/karma/index.js')(grunt),
      browserify : {
        dev : {
          options: {
            browserifyOptions : {
              debug : true,
              standalone: 'scxml'
            }
          },
          src: ['lib/runtime/facade.js'],
          dest: 'dist/scxml.js'
        }
      },
      express: {
        dev: {
          options: {
            node_env: 'development',
            livereload: true,
            script: 'grunt/server.js',
            port: 3000
          }
        },
        prod: {
          options: {
            node_env: 'production',
            script: 'grunt/server.js',
            port: 3000
          }
        },
        "prod-require": {
          options: {
            node_env: 'production-require',
            script: 'grunt/server.js',
            port: 3000
          }
        },
        "scxml" : {
          options: {
            port : 42000,
            script: 'test/node-test-server.js'
          }
        }
      },
      'saucelabs-custom': {
        all: {
          options: {
            urls: [
              'http://127.0.0.1:3000/'
            ],
            browsers: browsers,
            build: process.env.TRAVIS_JOB_ID,
            testname: 'custom tests',
            throttled: 5,
            statusCheckAttempts : -1,
            sauceConfig: {
              'video-upload-on-pass': false
            }
          }
        }
      },
      gitcommit: {
          dist: {
              options: {
                  message: 'Updated dist files',
              },
              files: {
                  src: [
                    'dist/scxml.js',
                    'dist/scxml.js.map',
                    'dist/scxml.min.js'
                  ]
              }
          }
      },
      release: {
        options: {
          beforeRelease : ['build', 'gitcommit:dist'],
          additionalFiles: ['bower.json'],
          github: {
            repo: 'jbeard4/SCION', //put your user/repo here
            accessTokenVar: 'GITHUB_ACCESS_TOKEN', //ENVIRONMENT VARIABLE that contains GitHub Access Token
          }
        }
      },
      watch: {
        options: {
          livereload: false
        },
        express: {
          files:  [ 'lib/**/*.js' ],
          tasks : ['browserify:dev'],
          options: {
            spawn: false
          }
        },
        browserify: {
          files: ["lib/**/*.js"],
          tasks: ["browserify:dev"]
        },
        public: {
          files: [""]
        }
      }

  });

  grunt.registerTask('mywatch',['express:dev:start','watch:express']);
  grunt.registerTask('mywatch-prod',['build','express:prod:start','watch:express']);

  grunt.registerTask('replace-reserved-words', 'String replace reserved words in built JavaScript.', function() {
    var fs = require('fs');
    var fileContents = fs.readFileSync('dist/scxml.js','utf8');
    ['return','delete'].forEach(function(s){
      fileContents = fileContents.replace(new RegExp('\\.\\b' + s + '\\b','g'), '["' + s + '"]'); 
    });
    fs.writeFileSync('dist/scxml.js', fileContents);
  });

  grunt.registerTask('scxml-test-client', 'Run scxml tests in node. ', function(){
    var done = this.async();
    //TODO: convert to submodule. 
    var startTests = require('scxml-test-framework');
    startTests({
      verbose : true,
      report : console,
      scxmlTestFiles : grunt.file.expand(require('./grunt/scxml-tests.json'))
    }, done);
  });

  //TODO: copy babel-polyfill and nodeunit-browser into test/harness/browser/lib. I wish these were published via bower. 
  grunt.task.registerTask('test-semantics', ['express:scxml', 'scxml-test-client', 'express:scxml:stop']);
  grunt.registerTask('build', [ 'browserify:dev', 'babel', 'replace-reserved-words', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test-node', ['nodeunit:platform', 'test-semantics']);
  grunt.registerTask('test', [
    'test-node',
    'run-browser-tests-dev' 
  ]);
  grunt.registerTask('run-browser-tests-dev', ['express:dev', 'saucelabs-custom', 'express:dev:stop' ]);
  grunt.registerTask('run-browser-tests-prod', ['express:prod', 'saucelabs-custom', 'express:prod:stop' ]);
};

