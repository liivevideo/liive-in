const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const devServer = {
    outputPath: path.join(__dirname, 'build'),
    contentBase: path.resolve(__dirname, 'build'),
    colors: true,
    quiet: true,
    noInfo: false,
    publicPath: path.join(__dirname, 'build'),
    historyApiFallback: false,
    host: '127.0.0.1',
    port: 3000,
    hot: false
};
module.exports = {
    target: 'web',
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
        new WriteFilePlugin(),
        new CopyWebpackPlugin([
            {from: 'web/index.html', to: './', force: false},
            {from: 'web/build/bundle.*', to: '../../server/public/build', force: true, flatten:true},
        ], {copyUnmodified: true})
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            'react-native': 'react-native-web',
            'react-native-webrtc': 'react-native-web-webrtc',
        }
    },
    module: {

        loaders: [
            {
                test: /\.js$/,
                externals: [nodeExternals()],

                // include: [path.resolve(__dirname, '../app'), path.resolve(__dirname, '../index.web.js')],

                exclude: /node_modules\/(?!(react-native-webrtc|react-native-web-webrtc)\/).*/,
                //exclude: /node_modules\/(?!(react-native-webrtc|react-native-vector-icons|native-base|react-native-keyboard-aware-scroll-view|react-native-vector-icons|react-native-easy-grid|react-native-web-webrtc|react-native-modalbox)\/).*/,
                // include: ['./js/setup','react-native-vector-icons','react-native-easy-grid','react-native-webrtc','native-base','react-native-web-webrtc','react-native-modalbox'],
                // include: [
                //     path.resolve(__dirname, 'js'),
                //     path.resolve(__dirname, 'node_modules')
                // ],
                // exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        "es2015",
                        "react",
                        "react-native",
                        "stage-1",
                    ],
                    plugins: [
                        // "transform-runtime",
                        // 'add-module-exports',
                        "transform-decorators-legacy",
                        "transform-class-properties",
                        "syntax-flow",

                    ],
                    // optional: ["es7.decorators", "es7.classProperties"]
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    }
}
