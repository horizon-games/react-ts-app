const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const shared = require('./shared');
const main = [
  'whatwg-fetch',
  './src/index.tsx'
];
// const vendor = shared.makeVendorEntry({ mainModules: main, modulesToExclude: [''] })
const vendor = [
  'react',
  'react-dom',
  'mobx',
  'mobx-little-router',
  'mobx-little-router-react',
  'history'
]

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main: main,
    vendor: vendor
  },
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      memoryLimit: 4096,
      checkSyntacticErrors: true
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJSPlugin({
      uglifyOptions: {
        unused: true,
        dead_code: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      template: 'src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../.stats/index.html'
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
    extensions: [".tsx", ".ts", ".js"]
  }
};