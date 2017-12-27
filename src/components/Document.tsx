// Document component is used by server side rendering to generate
// static html document for the matching route.
import * as React from 'react'
import Helmet from 'react-helmet'
import env from 'src/utils/env'

interface DocumentProps {
  styles: React.ReactElement<{}>[]
  assets: { js: string[], css: string[] }
  state: string
  content: string
  env: typeof env
}

const Document: React.SFC<DocumentProps> = (props) => {
  const { assets, styles, state, content, env } = props

  const helmet = Helmet.renderStatic()
  const htmlAttrs = helmet.htmlAttributes.toComponent()
  const bodyAttrs = helmet.bodyAttributes.toComponent()

  return (
    <html lang='en' {...htmlAttrs}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {assets.css.map(path => <link rel='stylesheet' type='text/css' key={path} href={path} />)}
        {styles}
      </head>
      <body {...bodyAttrs}>
        <div id='app' dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: state }} />
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`
          }}
        />
        {assets.js.map(path => <script key={path} src={path} />)}
      </body>
    </html>
  )
}

export default Document
