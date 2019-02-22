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
        filename: '[name].js?[hash:8]'
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

        // new webpack.HotModuleReplacementPlugin(),

        new CleanWebpackPlugin(["dist"]),

        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash:6].css',
            chunkFilename: '[id].[chunkhash:6].css'
            // filename: 'ls.css'
        }),

        new HtmlWebpackPlugin({
            title: 'demo',
            template: './src/demo/index.html',
            filename: 'index.html',
            chunks: ["demo"]
        }),

    ]
};
