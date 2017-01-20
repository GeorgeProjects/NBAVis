var config = require('./config.js')
var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var gulpUglify = require('gulp-uglify')
var gulpCleanCss = require('gulp-clean-css')
var skyFUtils = require('skyfutils/dist/skyfutils.js').install({ env: 'node', globalInstall: false })

/**
 * 启动Banner
 */
function startBanner () {
  var str = skyFUtils.SkyEyeBanner(config.PACKAGE_JSON.name, { notPrint: true, wordSpace: 2 })
  process.stdout.write('\n' + str + '\n')
}
exports.startBanner = startBanner

/**
 * banner 信息
 * @returns {string}
 */
function banner () {
  return config.PACKAGE_JSON.name + '\n' +
    'Version: ' + config.PACKAGE_JSON.version + '\n' +
    'Author: ' + config.PACKAGE_JSON.author + '\n' +
    'Group: ' + config.PACKAGE_JSON._addons.group + '\n' +
    'Build Time: ' + new Date().toLocaleString()
}
exports.banner = banner

/**
 * 变量定义
 * @param env
 * @constructor
 */
function SkyEyeDefinePlugin (env, defineVars) {
  var v = {
    'ENV': env,
    'PACKAGE_JSON': config.PACKAGE_JSON
  }
  if (defineVars) {
    v.defineVars = defineVars
  }
  return new webpack.DefinePlugin({
    'process.SkyEye': JSON.stringify(v)
  })
}
exports.SkyEyeDefinePlugin = SkyEyeDefinePlugin

/**
 * 字符串加边框(不支持中文)
 * @param str
 */
exports.strBordered = function (str) {
  return skyFUtils.SkyEyeStrBordered(str, true)
}

/**
 * 获取webpack-assets.json
 * @returns {*}
 */
function getWebpackAssetsJson () {
  if (!fs.existsSync(config.webpackAssetsJsonAbsolutePath)) {
    throw new gulpUtil.PluginError('webpack', '打包未完成')
  }
  return require(config.webpackAssetsJsonAbsolutePath)
}
exports.getWebpackAssetsJson = getWebpackAssetsJson

/**
 * 获取指定chunk的资源路径
 * @param arr
 * @param chunk
 * @returns {*}
 */
function getThisChunkAssetsPath (arr, chunk) {
  var tmp = arr.filter(function (ext) {
    return ext.chunk.indexOf(chunk) !== -1
  }).map(function (ext) {
    return ext.path
  })
  if (tmp.length) {
    return tmp
  } else {
    return null
  }
}
exports.getThisChunkAssetsPath = getThisChunkAssetsPath

/**
 * 拷贝文件至生产模式发布目录
 * @param oldPath
 * @returns {*}
 */
function copyFileToDistProAbsolutePath (oldPath) {
  var fName = path.basename(oldPath)
  var ext = path.extname(oldPath)
  var src = config.contextAbsolutePath + oldPath
  var des = config.distProAbsolutePath
  var task = gulp.src(src)
  if (ext === '.js') {
    task.pipe(gulpUglify())
  } else if (ext === '.css') {
    task.pipe(gulpCleanCss())
  }
  task.pipe(gulp.dest(des))
  return config.distPublicPath + fName
}
exports.copyFileToDistProAbsolutePath = copyFileToDistProAbsolutePath

/**
 * 获取指定chunk的资源
 * @param customConfig
 * @param chunk
 * @returns {{}}
 */
function getThisChunkAssets (customConfig, chunk) {
  var assets = {}
  var favicon = getThisChunkAssetsPath(customConfig.assets.favicon, chunk)
  if (favicon) {
    assets.favicon = favicon.pop() // string
  }
  assets.css = getThisChunkAssetsPath(customConfig.assets.css, chunk) // array
  assets.externals = getThisChunkAssetsPath(customConfig.externals, chunk) // array
  assets.webpack = getWebpackAssetsJson() // object
  return assets
}
exports.getThisChunkAssets = getThisChunkAssets

/**
 * Less Loader
 * @param styleHash
 * @returns {string}
 */
function lessLoader (styleHash) {
  return 'css-loader?modules&importLoaders=1&localIdentName=[local]' + (styleHash ? '-[hash:base64:7]' : '') + // [name] 文件名 [local]原始样式名
    '!postcss-loader' +
    '!less-loader'
}
exports.lessLoader = lessLoader
