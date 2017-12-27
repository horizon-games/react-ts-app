import * as React from 'react'
import { Provider, observer } from 'mobx-react'
import { RouterProvider, Outlet } from 'mobx-little-router-react'
import styled, { injectGlobal } from 'styled-components'
import Helmet from 'react-helmet'
import Header from './components/Header'

interface AppProps {
  router: any
  stores: any
}

@observer
class App extends React.Component<AppProps> {
  render() {
    const { router, stores } = this.props

    return (
      <Provider {...stores}>
        <RouterProvider router={router}>
          <div>
            <Helmet titleTemplate='react-ts-app - %s'>
              <title>react-ts.app</title>
              <meta name='description' content='yeay app' />
              <meta name='viewport' content='width=device-width, initial-scale=1.0' />
              <link rel='icon' href='' />
            </Helmet>
            <div>
              <Header />
              <Viewport>
                <p>pathname: <b>{JSON.stringify(this.props.router.location.pathname)}</b></p>
                <Outlet />
                <Outlet name='modal' />
              </Viewport>
            </div>
          </div>
        </RouterProvider>
      </Provider>
    )
  }
}

const Viewport = styled.div`
  padding: 54px 18px;
`

injectGlobal`
  body {
    font-family: "Helvetica Neue", sans-serif;
    padding: 0;
    margin: 0;

    * {
      box-sizing: border-box;
    }
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }
`

export default App
