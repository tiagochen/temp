// import 'theme/styles/app.css'
// import 'theme/styles/app.scss'
// import 'fish/dist/fish.less' // 按需加载样式，无需重新打包

// 使用babel-plugin-transform-runtime代替babel-polyfill
// import 'babel-polyfill'
/* eslint-disable */
if (window.codeCdnUrl) {
  __webpack_public_path__ = window.codeCdnUrl
}
/* eslint-enable */
require('es6-promise').polyfill()
// api地址配置，及一些根据环境配置的常量
window.__config = process.env.__CONFIG
const React = require('react')
const render = require('react-dom').render
const Provider = require('react-redux').Provider
const syncHistoryWithStore = require('react-router-redux/lib/sync').default
const configureStore = require('./store/configureStore')
const routes = require('./routes')
const routerHistory = require('react-router').useRouterHistory
const createHistory = require('history').createHashHistory
const store = configureStore()
// 移除react-router自动添加的_k=xxx参数
const hashHistory = routerHistory(createHistory)({queryKey: true})
const history = syncHistoryWithStore(hashHistory, store)

render((
  <Provider store={store}>
    {routes(history)}
  </Provider>
), document.getElementById('app'))
