/**
 * 开发模式
 */
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./config.js')
var utils = require('./utils.js')
var baseWebpackConfig = require('./webpack.base.config.js')
var hotEntry = 'webpack-hot-middleware/client?http://localhost:' + config.custom.devServer.port + '/&noInfo=true&reload=true'

module.exports = merge(baseWebpackConfig, {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: (function () {
    var map = {}
    config.custom.entryArray.forEach(function (item) {
      map[ item.name ] = [ hotEntry, config.entryAbsolutePath + '/' + item.name + '.js' ]
    })
    return map
  })(),
  output: {
    path: config.distAbsolutePath,
    filename: '[name].bundle.js',
    chunkFilename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [ {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.less$/,
      loader: 'style-loader!' + utils.lessLoader(config.custom.styleHash)
    } ]
  },
  plugins: (function () {
    var arr = [
      utils.SkyEyeDefinePlugin('dev', config.custom.defineVars),
      new webpack.HotModuleReplacementPlugin()
    ]
    return arr
  })()
})
