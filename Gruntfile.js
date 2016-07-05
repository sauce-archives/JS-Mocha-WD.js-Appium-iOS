'use strict';

var simAppFile = 'GuineaPig-sim-debug.app.zip';
var devAppFile = 'GuineaPig-dev-debug.app.zip';

module.exports = function (grunt) {
    // configure tasks
    grunt.initConfig({
        mocha_parallel: {
            options: {
                args: function(suiteName) {
                    return [];
                },
                env: function(suiteName) {
                    process.env.platformName = grunt.option('platformName');
                    process.env.platformVersion = grunt.option('platformVersion');
                    process.env.deviceName = grunt.option('deviceName');
                    process.env.app = grunt.option('app');
                    return process.env;
                },
                report: function(suite, code, stdout, stderr) {
                    if (stdout.length) {
                      process.stdout.write(stdout);
                    }
                    if (stderr.length) {
                      process.stderr.write(stderr);
                    }
                },
                done: function(success, results) {
                },
                mocha: './node_modules/.bin/mocha'
            }
        },
        
        parallel: {
            assets: {
                options: {
                    grunt: true
                },
                tasks: ['run_iPhone_6_Simulator', 'run_iPhone_6_Real_Device']
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-mocha-parallel');
    grunt.loadNpmTasks('grunt-parallel');

    grunt.registerTask('iPhone_6_Simulator', function(n) {
      grunt.option('platformName', 'iOS');
      grunt.option('platformVersion', '9.2');
      grunt.option('deviceName', "iPhone 6");
      grunt.option('app', 'sauce-storage:' + simAppFile);
    });

    grunt.registerTask('iPhone_6_Real_Device', function(n) {
      grunt.option('platformName', 'iOS');
      grunt.option('platformVersion', '8.4');
      grunt.option('deviceName', "iPhone 6 Device");
      grunt.option('app', 'sauce-storage:' + devAppFile);
    });

    // register tasks
    grunt.registerTask('default', ['parallel']);

    grunt.registerTask('run_iPhone_6_Simulator', ['iPhone_6_Simulator', 'mocha_parallel']);
    grunt.registerTask('run_iPhone_6_Real_Device', ['iPhone_6_Real_Device', 'mocha_parallel']);
    
};

