// Karma configuration
// Generated on Sat Jan 13 2018 18:17:43 GMT+0300 (E. Africa Standard Time)

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = ['./src/main.js'];

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'tests/*Spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        './tests/*.js': ['webpack', 'sourcemap'],
        './src/**/*js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //coverage https://github.com/karma-runner/karma-coverage
    reporters: ['progress', 'coverage'],

    // optionally, configure the reporter
    coverageReporter: {
        reporters: [
            // generates ./coverage/lcov.info
            {type:'lcovonly', subdir: '.'},
            // generates ./coverage/coverage-final.json
            {type:'json', subdir: '.'},
        ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome','Firefox'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
    webpack: webpackConfig,
    
    webpackMiddleWare: {
      noInfo: true
    }
    
  })
}
