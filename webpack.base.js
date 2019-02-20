const path = require('path');
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        index: path.resolve(__dirname, "./src/index.js"),
        demo: path.resolve(__dirname, "./src/demo/demo.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js?[hash:8]',
        // library: 'numberWord', // 指定类库名,主要用于直接引用的方式(比如script)
        libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
        globalObject: 'this', // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
        libraryTarget: 'umd' // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader']
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader',
                ]
            },
            {
                test: /\.(png|jpg|jpeg|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                    limit: 10000,
                },
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.styl'],
        alias: {
            "@stylus": path.resolve(__dirname, "src/stylus/"),
        }
    },
    plugins: [
        // new BundleAnalyzerPlugin(),

        new webpack.HotModuleReplacementPlugin(),

        new CleanWebpackPlugin(["dist"]),

        new MiniCssExtractPlugin({
            // filename: '[name].[chunkhash:6].css',
            // chunkFilename: '[id].[chunkhash:6].css'
            filename: '[name].[chunkhash:6].css',
            chunkFilename: 'ls.css'
        }),

        new HtmlWebpackPlugin({
            title: 'demo',
            template: './src/demo/index.html',
            filename: 'index.html',
            chunks: ["demo"]
        }),

    ]
};
