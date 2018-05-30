import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import FrameMenu from '../modules/shared/layouts/frame'

const login = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('../modules/account/login'))
  }, 'login')
}

const active = (location, callback) => {
  require.ensure([], require => {
    callback(null, require('../modules/setting/active'))
  }, 'active')
}

const routes = history => (
  <Router history={history}>
    <Route path='login' getComponent={login} />
    <Route path='/admin' component={FrameMenu}>
      <IndexRoute getComponent={active} />
      <Route path='active' getComponent={active} />
    </Route>
  </Router>
)

export default routes
