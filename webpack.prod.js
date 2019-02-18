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
            chunks: "all"
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