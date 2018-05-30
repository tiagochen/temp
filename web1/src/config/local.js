var merge = require('webpack-merge')
var devEnv = require('./development')
var env = 'dev';
module.exports = merge(devEnv, {
  NODE_ENV: '"' + env + '"',
  env: env,
});
