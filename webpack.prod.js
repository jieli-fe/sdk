const path = require('path');
const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
let prod = merge(baseConfig, {
    mode: "production",
    output: {
        publicPath: './',
        path: path.resolve(__dirname, "lib"),
        filename: '[name].js?[hash:8]',
        library: 'LS',
        libraryTarget: 'umd'
    },
    /* optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                leaflet: {
                    name: "leaflet",
                    priority: 100,
                    test: /[\/]node_modules[\/]leaflet[\/]/
                },
                // index: {
                //     minSize: 0,
                //     name: "index",
                //     reuseExistingChunk: true
                // }
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
    }, */
    plugins: [
        new CleanWebpackPlugin(["lib"]),
    ],
    devtool: "none"
});
console.log("打包到相对路径：" + prod.output.publicPath)
module.exports = prod