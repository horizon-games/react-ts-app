const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const shared = require('./shared')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AssetsByTypePlugin = require('webpack-assets-by-type-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const main = [
  'whatwg-fetch'
]

const vendor = [
  'core-js/shim',
  'global',
  'history',
  'mobx',
  'mobx-little-router',
  'mobx-little-router-react',
  'react',
  'react-dom',
  'react-helmet'
]

const sharedConfig = {
  context: process.cwd(), // to automatically find tsconfig.json
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: false,
        compress: {
          dead_code: true,
          unused: true
        },
        output: {
          comments: false,
          beautify: false
        }
      }
    })
  ],
  module: {
    rules: [{
      test: /.tsx?$/,
      use: [{
        loader: 'ts-loader', options: { transpileOnly: true }
      }],
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      src: path.join(process.cwd(), 'src')
    }
  }
}

const clientConfig = {
  ...sharedConfig,
  target: 'web',
  entry: {
    'main': [...main, './src/client.tsx'],
    'vendor': vendor
  },
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: 'bundle.[name]-[chunkhash].js'
  },
  plugins: [
    ...sharedConfig.plugins,
    new ForkTsCheckerWebpackPlugin({
      async: false,
      memoryLimit: 4096,
      checkSyntacticErrors: true
    }),
    new webpack.DefinePlugin(shared.appEnvVars('config/app.dist.env')),
    // TODO: refactor to use optimization.splitChunks, 
    // see https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    //
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'client',
    //   async: true,
    //   children: true
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/client.html'
    }),
    new AssetsByTypePlugin({
      path: path.join(process.cwd(), 'dist/assets.json')
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '.stats/index.html'
    })
  ]
}

const serverConfig = {
  ...sharedConfig,
  target: 'node',
  entry: [
    './src/server.tsx'
  ],
  externals: [
    'express'
  ],
  output: {
    path: path.join(process.cwd(), 'dist'),
    libraryTarget: 'commonjs2',
    filename: 'server.js'
  },
  plugins: [
    ...sharedConfig.plugins,
    new webpack.DefinePlugin(shared.appEnvVars('config/app.dist.env', { server: true })),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.ProvidePlugin({
      // fetch: 'node-fetch' // TODO ...?
    }),
    new webpack.BannerPlugin({
      banner: 'global.assets = require("./assets.json");',
      raw: true,
    })
  ]
}

module.exports = [
  clientConfig, serverConfig
]
