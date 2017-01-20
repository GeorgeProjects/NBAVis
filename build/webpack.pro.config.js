/**
 * 发布模式
 */
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./config.js')
var utils = require('./utils.js')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var baseWebpackConfig = require('./webpack.base.config.js')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCSS = new ExtractTextPlugin('[name].bundle.[hash:8].css', { allChunks: true })

module.exports = merge(baseWebpackConfig, {
  devtool: 'cheap-source-map',
  entry: (function () {
    var map = {}
    map.vendor = config.custom.vendor
    config.custom.entryArray.forEach(function (item) {
      map[ item.name ] = config.entryAbsolutePath + '/' + item.name + '.js'
    })
    return map
  })(),
  output: {
    path: config.distProAbsolutePath,
    filename: '[name].bundle.[hash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [ {
      test: /\.css$/,
      loader: extractCSS.extract('style-loader', 'css-loader')
    }, {
      test: /\.less$/,
      loader: extractCSS.extract('style-loader', utils.lessLoader(config.custom.styleHash))
    } ]
  },
  plugins: (function () {
    var distPathObj = path.parse(config.distProAbsolutePath)
    var arr = [
      extractCSS,
      utils.SkyEyeDefinePlugin('pro', config.custom.defineVars),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          cascade: false
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: 2
      }),
      new CleanWebpackPlugin([ distPathObj.name ], {
        root: distPathObj.dir,
        verbose: true,
        dry: false
      })
    ]
    return arr
  })()
})
