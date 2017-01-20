var webpack = require('webpack')
var webpackConfig = require('./webpack.dev.config.js')
var config = require('./config')
var utils = require('./utils')
var express = require('express')
var gulpUtil = require('gulp-util')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var proxyMiddleware = require('http-proxy-middleware')

module.exports = function () {
  // web server
  var server = express()
  server.listen(config.custom.devServer.port, config.custom.devServer.host, function (err) {
    var init = 1
    if (err) {
      throw new gulpUtil.PluginError('webpack', err)
    }
    gulpUtil.log(utils.strBordered('Dev Server is running at http://' + config.custom.devServer.host + ':' + config.custom.devServer.port))
    // compiler
    var compiler = webpack(webpackConfig)
    // dev中间件
    server.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        chunks: false
      },
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      }
    }))
    // hot-load中间件
    server.use(webpackHotMiddleware(compiler))
    compiler.plugin('done', function () {
      if (init) {
        // 代理服务
        if (config.custom.devServer.proxy instanceof Function) {
          config.custom.devServer.proxy(server, proxyMiddleware)
        } else if (config.custom.devServer.proxy instanceof Array) {
          config.custom.devServer.proxy.forEach(function (item) {
            server.use(item.path, proxyMiddleware(item.config))
          })
        }
      }
      init = 0
    })
  })
  // 静态资源服务
  server.use(express.static(config.contextAbsolutePath))
  server.engine('ejs', require('ejs').renderFile)
  server.set('views', config.viewsAbsolutePath)
  // Page Router
  config.custom.entryArray.forEach(function (item) {
    server.get(item.router, function (req, res) {
      item.assets = utils.getThisChunkAssets(config.custom, item.name)
      res.render(item.name + '.ejs', item)
    })
  })
}
