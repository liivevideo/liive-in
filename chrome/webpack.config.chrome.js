const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devServer= {
  outputPath: path.join(__dirname, 'build'),
  contentBase: path.resolve(__dirname, 'build'),
  colors: true,
  quiet: true,
  noInfo: false,
  publicPath: '/assets/',
  historyApiFallback: false,
  host: '127.0.0.1',
  port: 3001,
  hot: false
};
module.exports = {
  devtool: 'source-map',
  devServer: devServer,
  entry: [
    path.join(__dirname, '../index.chrome.js')
  ],
  output: {
    path: devServer.outputPath,
    filename: 'bundle.js',
    publicPath: devServer.publicPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new WriteFilePlugin(),
    new CopyWebpackPlugin([
      { from: 'chrome/assets', to: './assets', force: false },
      { from: 'chrome/index.js', to: './', force: false },
      { from: 'chrome/index.html', to: './', force: false },
      { from: 'chrome/manifest.json', to: './', force: false },
    ],{ copyUnmodified: true })
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-webrtc': 'react-native-web-webrtc',
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(react-native-webrtc|react-native-web-webrtc)\/).*/,
        loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
        query: {
          presets: [
            "es2015",
            "stage-1",
            "react",
            "react-native"
          ],
          plugins: [
            "transform-decorators-legacy",
            "syntax-flow"
          ]
        }
      }
    ],
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  },
}
