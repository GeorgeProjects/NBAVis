/**
 * Created by huangxinxin on 16/8/11.
 * 配置请勿随意修改, 除非你熟练使用webpack
 */
var path = require('path')
var gulpUtil = require('gulp-util')

// custom
var custom = mergeCustomConfig(require('../config.custom'))
exports.custom = custom

// context
var contextRelativePath = '../'
exports.contextAbsolutePath = path.resolve(__dirname, contextRelativePath)

// package.json
var PACKAGE_JSON = require('../package.json')
exports.PACKAGE_JSON = PACKAGE_JSON

// templates
exports.templatesAbsolutePath = clearPathLastChar(custom.buildDist.template)

// dist(output)
var distRelativePath = '../dist'
var distAbsolutePath = path.resolve(__dirname, distRelativePath)
var distPublicPath = addPathLastChar(custom.buildDist.public)
var distProAbsolutePath = clearPathLastChar(custom.buildDist.bundle)
exports.distRelativePath = distRelativePath
exports.distAbsolutePath = distAbsolutePath
exports.distPublicPath = distPublicPath
exports.distProAbsolutePath = distProAbsolutePath

// assets
var assetsRelativePath = '../assets'
var assetsAbsolutePath = path.resolve(__dirname, assetsRelativePath)
exports.assetsRelativePath = assetsRelativePath
exports.assetsAbsolutePath = assetsAbsolutePath

// src
var srcRelativePath = '../src'
var srcAbsolutePath = path.resolve(__dirname, srcRelativePath)
exports.srcRelativePath = srcRelativePath
exports.srcAbsolutePath = srcAbsolutePath

// entry
var entryRelativePath = srcRelativePath + '/entry'
var entryAbsolutePath = path.resolve(__dirname, entryRelativePath)
exports.entryRelativePath = entryRelativePath
exports.entryAbsolutePath = entryAbsolutePath

// views
var viewsRelativePath = '../views'
var viewsAbsolutePath = path.resolve(__dirname, viewsRelativePath)
exports.viewsRelativePath = viewsRelativePath
exports.viewsAbsolutePath = viewsAbsolutePath

// webpack-assets.json
var webpackAssetsJsonRelativePath = '../webpack-assets.json'
var webpackAssetsJsonAbsolutePath = path.resolve(__dirname, webpackAssetsJsonRelativePath)
exports.webpackAssetsJsonRelativePath = webpackAssetsJsonRelativePath
exports.webpackAssetsJsonAbsolutePath = webpackAssetsJsonAbsolutePath

/**
 * 去掉末尾'/'字符
 * @param str
 * @returns {*}
 */
function clearPathLastChar (str) {
  var l = str.length
  var c = str.charAt(l - 1)
  if (c === '/') {
    str = str.slice(0, l - 1)
  }
  return str
}

/**
 * 末尾增加'/'字符
 * @param str
 * @returns {*}
 */
function addPathLastChar (str) {
  var l = str.length
  var c = str.charAt(l - 1)
  if (c !== '/') {
    str = str + '/'
  }
  return str
}

/**
 * 自定义配置合并
 * @param conf
 * @returns {{}}
 */
function mergeCustomConfig (conf) {
  var customConfigMerged = {
    esLint: true,
    styleLint: true,
    styleHash: true,
    defineVars: null,
    entryArray: [],
    vendor: [],
    externals: [],
    provide: {},
    assets: {
      favicon: [],
      css: []
    },
    alias: {},
    devServer: {
      port: 3000,
      proxy: null
    },
    buildDist: {
      public: '',
      bundle: '',
      template: ''
    }
  }
  if (conf instanceof Object) {
    customConfigMerged.defineVars = conf.defineVars
    if (typeof conf.esLint === 'boolean') {
      customConfigMerged.esLint = conf.esLint
    }

    if (typeof conf.styleLint === 'boolean') {
      customConfigMerged.styleLint = conf.styleLint
    }

    if (typeof conf.styleHash === 'boolean') {
      customConfigMerged.styleHash = conf.styleHash
    }

    if (conf.entryArray instanceof Array) {
      customConfigMerged.entryArray = conf.entryArray.filter(function (item) {
        return item.name && item.router && typeof item.name === 'string'
      })
      if (!customConfigMerged.entryArray.length) {
        throw new gulpUtil.PluginError('webpack', 'entryArray为空')
      }
    } else {
      throw new gulpUtil.PluginError('webpack', 'entryArray类型错误')
    }

    if (conf.vendor instanceof Array) {
      customConfigMerged.vendor = conf.vendor.filter(function (item) {
        return typeof item === 'string'
      })
    }

    if (conf.externals instanceof Array) {
      customConfigMerged.externals = conf.externals.filter(function (item) {
        if (item.package && item.var && item.path && item.chunk) {
          var flag = item.CDN || path.isAbsolute(item.path)
          if (!flag) {
            gulpUtil.log('externals path 不是绝对路径', JSON.stringify(item))
          }
          return flag
        }
        return false
      })
    }

    if (conf.provide instanceof Object) {
      for (var k in conf.provide) {
        if (typeof conf.provide[ k ] === 'string') {
          customConfigMerged.provide[ k ] = conf.provide[ k ]
        }
      }
    }

    if (conf.assets instanceof Object) {
      if (conf.assets.favicon instanceof Array) {
        customConfigMerged.assets.favicon = conf.assets.favicon.filter(function (item) {
          if (item.path && item.chunk) {
            var flag = item.CDN || path.isAbsolute(item.path)
            if (!flag) {
              gulpUtil.log('assets.favicon path 不是绝对路径', JSON.stringify(item))
            }
            return flag
          }
          return false
        })
      }
      if (conf.assets.css instanceof Array) {
        customConfigMerged.assets.css = conf.assets.css.filter(function (item) {
          if (item.path && item.chunk) {
            var flag = item.CDN || path.isAbsolute(item.path)
            if (!flag) {
              gulpUtil.log('assets.css path 不是绝对路径', JSON.stringify(item))
            }
            return flag
          }
          return false
        })
      }
    }

    if (conf.alias instanceof Object) {
      for (var k1 in conf.alias) {
        if (typeof conf.alias[ k1 ] === 'string') {
          customConfigMerged.alias[ k1 ] = conf.alias[ k1 ]
        }
      }
    }

    if (conf.devServer instanceof Object) {
      if (!isNaN(+conf.devServer.port)) {
        customConfigMerged.devServer.port = conf.devServer.port
      }

      if (typeof conf.devServer.host === 'string') {
        customConfigMerged.devServer.host = conf.devServer.host
      }

      if (conf.devServer.proxy instanceof Array) {
        customConfigMerged.devServer.proxy = conf.devServer.proxy.filter(function (item) {
          return item.hasOwnProperty('path') && item.hasOwnProperty('config')
        })
      } else if (conf.devServer.proxy instanceof Function) {
        customConfigMerged.devServer.proxy = conf.devServer.proxy
      }
    }

    if (conf.buildDist instanceof Object) {
      if (typeof conf.buildDist.public === 'string') {
        customConfigMerged.buildDist.public = conf.buildDist.public
      }

      if (typeof conf.buildDist.bundle === 'string') {
        customConfigMerged.buildDist.bundle = conf.buildDist.bundle
      }

      if (typeof conf.buildDist.template === 'string') {
        customConfigMerged.buildDist.template = conf.buildDist.template
      }
    }

    if (!path.isAbsolute(customConfigMerged.buildDist.public)) {
      throw new gulpUtil.PluginError('webpack', 'buildDist.public`' + customConfigMerged.buildDist.public + '` 不是绝对路径')
    }
    if (!path.isAbsolute(customConfigMerged.buildDist.bundle)) {
      throw new gulpUtil.PluginError('webpack', 'buildDist.bundle`' + customConfigMerged.buildDist.bundle + '` 不是绝对路径')
    }
    if (!path.isAbsolute(customConfigMerged.buildDist.template)) {
      throw new gulpUtil.PluginError('webpack', 'buildDist.template`' + customConfigMerged.buildDist.template + '` 不是绝对路径')
    }
  } else {
    throw new gulpUtil.PluginError('webpack', '用户配置类型错误')
  }
  return customConfigMerged
}
