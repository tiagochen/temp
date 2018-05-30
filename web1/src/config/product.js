var merge = require('webpack-merge')
var devEnv = require('./development')
var env = 'production';
module.exports = merge(devEnv, {
  NODE_ENV: '"' + env + '"',
  env: env,
  base_url: '',// 项目API地址

});
