'use strict'

let webpack = require('webpack')
let defaultSettings = require('./defaults')
let configEnv = require('../src/config')

let entryJsMain = defaultSettings.entryJs[defaultSettings.entryJsName]
if (!entryJsMain.unshift) {
  entryJsMain = [entryJsMain]
}
entryJsMain.unshift('webpack-hot-middleware/client?reload=true')

defaultSettings.entryJs[defaultSettings.entryJsName] = entryJsMain

module.exports = Object.assign({}, defaultSettings.base, {
  entry: defaultSettings.entryJs,
  cache: true,
  debug: true,
  devtool: 'inline-source-map',
  plugins: defaultSettings.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        '__CONFIG': JSON.stringify(configEnv.dev.env)
      }
    }),
    new webpack.HotModuleReplacementPlugin() // 热替换
  ])
})
