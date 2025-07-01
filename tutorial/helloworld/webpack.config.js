const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    // devtool: 'source-map',
    devtool: false,
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    // loader执行结果：
    // pitchA
    // pitchB
    // normalA
    module: {
        rules: [
            {
                test: /index.js/,
                use: [
                    {
                        loader: resolve(__dirname, 'loader', 'loaderA.js'),
                    },
                    {
                        loader: resolve(__dirname, 'loader', 'loaderB.js'),
                    },
                    {
                        loader: resolve(__dirname, 'loader', 'loaderC.js'),
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new CleanWebpackPlugin()
    ],
}
