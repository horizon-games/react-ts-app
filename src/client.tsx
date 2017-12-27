import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as mobx from 'mobx'
import { createBrowserHistory, createHashHistory } from 'history'
import { install } from 'mobx-little-router-react'
import App from './App'
import createStores from './stores'
import routes from './routes'
import env from './utils/env'

const stores = createStores()

const history = (() => {
  if (env.MODE === 'server' && env.SERVER_RENDERING === 'on') {
    return createBrowserHistory()
  } else {
    return createHashHistory()
  }
})()

const router = install({
  history: history,
  routes: routes,
  getContext: () => ({
    status: 200,
    stores: stores
  })
})

router.subscribeEvent(ev => {
  if (ev.type === 'NAVIGATION_START') {
    console.group(`%cNavigation (${ev.navigation.sequence})`, 'color: black')
  }

  if (ev.navigation && ev.navigation.sequence > -1) {
    console.log(`%c${ev.type}`, `color:${getGroupColor(ev)}`, `(${ev.elapsed}ms)`, ev)
  }

  if (ev.done) {
    console.groupEnd()
  }
})

function getGroupColor(ev) {
  switch (ev.type) {
    case 'NAVIGATION_START':
      return 'black'
    case 'NAVIGATION_CANCELLED':
      return 'red'
    case 'NAVIGATION_ERROR':
      return 'red'
    case 'NAVIGATION_END':
      return 'green'
    default:
      return '#999'
  }
}

{
  (window as any).mobx = mobx;
  (window as any).router = router
}

router.start(() => {
  let renderFn = ReactDOM.render
  if (env.MODE === 'server' && env.SERVER_RENDERING === 'on') {
    renderFn = ReactDOM.hydrate
  }

  renderFn(
    <App router={router} stores={stores} />,
    document.getElementById('app')
  )
})
