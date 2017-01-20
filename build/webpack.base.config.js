var config = require('./config')
var utils = require('./utils')
var precss = require('precss')
var webpack = require('webpack')
var ProgressBar = require('progress')
var autoprefixer = require('autoprefixer')
var AssetsPlugin = require('assets-webpack-plugin')
var StyleLintPlugin = require('stylelint-webpack-plugin')
// 提示进度条
var bar = new ProgressBar('webpack编译进度[:bar] :percent :elapsed秒', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100
})

module.exports = {
  output: {
    publicPath: config.distPublicPath
  },
  resolve: {
    root: config.contextAbsolutePath,
    alias: config.custom.alias
  },
  externals: (function () {
    var conf = {}
    config.custom.externals.forEach(function (item) {
      conf[ item.package ] = item.var
    })
    return conf
  })(),
  module: {
    noParse: [],
    preLoaders: (function () {
      var arr = []
      if (config.custom.esLint) {
        arr.push({
          test: /\.js$/,
          loader: 'eslint',
          exclude: /(node_modules|plugins|worker)/
        })
      }
      return arr
    })(),
    loaders: [ {
      test: /\.js$/,
      loader: 'babel',
      exclude: /(node_modules|plugins|worker)/
    }, {
      test: /\.vue$/,
      loader: 'vue!eslint',
      exclude: /(node_modules|plugins|worker)/
    }, {
      test: /\.worker\.js$/,
      loader: 'babel!worker',
      exclude: /(node_modules|plugins)/
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|gif)\??.*$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'images/[name].[hash:7].[ext]'
      }
    }, {
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    } ]
  },
  plugins: (function () {
    var arr = [
      new AssetsPlugin(),
      new webpack.BannerPlugin(utils.banner(), { entryOnly: true }),
      new webpack.ProvidePlugin(config.custom.provide),
      new webpack.ProgressPlugin(function handler (percentage) {
        bar.tick(~~(percentage * 100) - bar.curr)
      })
    ]
    if (config.custom.styleLint) {
      arr.push(new StyleLintPlugin({
        configFile: '.stylelintrc',
        context: config.srcAbsolutePath,
        files: '**/*.less',
        syntax: 'less'
      }))
    }
    return arr
  })(),
  postcss: function () {
    return {
      plugins: [ precss, autoprefixer ]
    }
  }
}
