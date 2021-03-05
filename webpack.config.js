const path = require('path');
const webpack = require('webpack');
// const ExtensionReloader  = require('webpack-extension-reloader');
// const WebExtensionTarget = require('webpack-target-webextension');
const RunChromeExtension = require('webpack-run-chrome-extension');

module.exports = {
  mode: 'development',

  entry: {
    contentScript: './src/contentScript.js',
    background: './src/background.js',
  },

  output: {
    path: path.join(path.resolve(__dirname), 'extension', 'dist'),
    // filename: '[name].js',
    publicPath: 'extension/dist/',
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/, },
      // { test: /\.svg$/, use: ['svg-inline-loader'], exclude: /node_modules/, },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
    // alias: {
      // images: path.resolve( __dirname, 'extension', 'images' ),
    // },
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // new RunChromeExtension({
      // extensionPath: path.join(path.resolve(__dirname), 'extension'),
      // startingUrl: 'https://store.bricklink.com/pb_bricks#/shop?o={%22sort%22:0,%22pgSize%22:100,%22showHomeItems%22:0}',
      // autoReload: true,
    // })
  ],

  devtool: 'eval-cheap-module-source-map',

  /*
  devServer: {
    // Have to write disk cause plugin cannot be loaded over network
    writeToDisk: true,
    compress: false,
    hot: true,
    hotOnly: true,
    // WDS does not support chrome-extension:// browser-extension://
    disableHostCheck: true,
    injectClient: true,
    injectHot: true,
    headers: {
      // We're doing CORS request for HMR
      'Access-Control-Allow-Origin': '*',
    },
    // If the content script runs in https, webpack will connect https://localhost:HMR_PORT
    https: false,
  },
  */
};
