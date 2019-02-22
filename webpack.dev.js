const path = require('path');
const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge")

module.exports = merge(baseConfig,{
    devtool: "source-map",
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: 9000,
        // hot: true,
        compress: true,
        open: true,
        historyApiFallback: true
    } 
})
