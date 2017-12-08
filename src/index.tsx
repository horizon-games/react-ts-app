import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as mobx from 'mobx'
import { createHashHistory } from 'history'
import { Provider } from 'mobx-react'
import { install, RouterProvider } from 'mobx-little-router-react'
import createStores from './stores'
import App from './App'
import routes from './routes'

const stores = createStores()

const router = install({
  history: createHashHistory(),
  getContext: () => ({
    stores
  }),
  routes: routes
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
  (window as any).store = router._store;
  (window as any).router = router;
  (window as any).mobx = mobx
}

router.start(() => {
  ReactDOM.render(
    <RouterProvider router={router}>
      <Provider {...stores}>
        <App />
      </Provider>
    </RouterProvider>,
    document.getElementById('root')
  )
})
