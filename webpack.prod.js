const path = require('path');
const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

let prod = merge(baseConfig, {
    mode: "production",
    output: {
        publicPath: './'
    },
    optimization: {
        splitChunks:{
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: { // 项目基本框架等
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
                    priority: 9,
                    minSize: 0,
                    minChunks: 2,
                    name: 'vendors',
                },
                'async-commons': { // 异步加载公共包、组件等
                    chunks: 'async',
                    minChunks: 2,
                    name: 'async-commons',
                    priority: 8,
                },
                commons: { // 其他同步加载公共包
                    chunks: 'all',
                    minChunks: 2,
                    name: 'commons',
                    priority: 7,
                },
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    priority: 10,
                    enforce: true,
                }
                
            }
        },
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    devtool: "none"
});
console.log("打包到相对路径：" + prod.output.publicPath)
module.exports = prod