'use strict'

let webpack = require('webpack')
let defaultSettings = require('./defaults')
let configEnv = require('../src/config')

module.exports = Object.assign({}, defaultSettings.base, {
  entry: defaultSettings.entryJs,
  cache: false,
  debug: false,
  devtool: false,
  plugins: defaultSettings.plugins.concat([
    new webpack.DefinePlugin({ // 全局变量
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        '__CONFIG': JSON.stringify(configEnv.build.env)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({ // 压缩
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin() // 打包优化
  ])
})
