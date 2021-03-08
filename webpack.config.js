const path = require('path');
const webpack = require('webpack');

// This is very good extension, but chrome only
// const RunChromeExtension = require('webpack-run-chrome-extension');

const createAbsPath = (...parts) => path.join(path.resolve(__dirname), ...parts);

const DESTINATION_PATH =createAbsPath('extension', 'dist');

module.exports = {
  mode: 'development',

  entry: {
    contentScript: './src/contentScript.js',
    background: './src/background.js',
  },

  output: {
    path: DESTINATION_PATH,
    publicPath: DESTINATION_PATH,
  },

  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/, },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'src',
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  devtool: 'source-map',
};
