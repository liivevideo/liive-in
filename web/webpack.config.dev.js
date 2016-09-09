const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin');

const DIRECTORY = path.join(__dirname)
const devServer = {
  outputPath: path.join(__dirname, 'src'),
  contentBase: path.resolve(__dirname, 'src'),
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
    path.join(__dirname, '../index.web.js')
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
    new WriteFilePlugin()
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
        loader: 'babel-loader',
        query: {
          presets: [
            "es2015",
            "stage-1",
            "react",
            "react-native",
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
  }
}
