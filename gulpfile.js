/**
 * Created by yichizhang on 16/7/21.
 */
var gulp = require('gulp')
var utils = require('./build/utils')
var taskDev = require('./build/dev')
var taskPro = require('./build/pro')

utils.startBanner()
gulp.task('dev', taskDev)
gulp.task('pro', taskPro)
