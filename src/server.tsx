// Server mode
import express from 'express'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import * as path from 'path'
import { useStaticRendering } from 'mobx-react'
import { install } from 'mobx-little-router-react'
import { createMemoryHistory } from 'history'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import createStores from './stores'
import routes from './routes'
import env from './utils/env'
import App from './App'
import Document from './components/Document'

// Mobx-react to prevent memory leaks on SSR
useStaticRendering(true)

// Set server mode
env.MODE = 'server'

// Assets list of js and css files for server-side rendering
const { assets } = global as any

// Setup assets for server side rendering.
// - filter out client bundles as they will load asynchronously
// - use absolute path
assets.js = assets.js.filter(filename => filename.indexOf('bundle') < 0 )
assets.js = assets.js.map(filename => '/' + filename)

// middleware to serve static files from dist/ folder
const serveStaticFiles = (() => {
  const mw = express.static(path.join(process.cwd(), 'dist'), { maxAge: 31536000000 })

  return (req, res, next) => {
    const location = req.url

    if (location === '/' || location === '/index.html' || location === '/server.js') {
      // avoid serving certain files in dist/ folder
      next()
    } else {
      // compose request path to route to the next middleware after
      // attempting to serve static files
      mw(req, res, next)
    }
  }
})()

// App server
const app = express()
app.disable('x-powered-by')

app.use(serveStaticFiles)

app.use(async (req, res) => {
  const stores = createStores()
  const ctx = {
    status: 200,
    stores: stores
  }
  const router = install({
    history: createMemoryHistory({ initialEntries: [req.url] }),
    routes: routes,
    getContext: () => ctx
  })
  const sheet = new ServerStyleSheet()

  try {
    await router.start()

    // Render app
    const content = ReactDOMServer.renderToString(
      <StyleSheetManager sheet={(sheet as any).instance}>
        <App router={router} stores={stores} />
      </StyleSheetManager>
    )

    // Render HTML
    const styles = sheet.getStyleElement()
    const state = ``

    const props = {
      styles, assets, state, content, env
    }

    const html = ReactDOMServer.renderToStaticMarkup(
      <Document {...props} />
    )

    if (ctx.status > 300 && ctx.status < 400) {
      res.redirect(ctx.status, router._store.location.pathname)
    } else {
      res.status(ctx.status).send(`<!doctype html>${html}`)
    }
  } catch (err) {
    res.status(500).send(`<h1>Server error</h1><pre>${err}</pre>`)
  }
})

app.listen(4000, () => {
  console.log('app server listening on port 4000')
})
