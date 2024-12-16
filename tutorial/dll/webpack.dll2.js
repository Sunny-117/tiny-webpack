const path = require('path');
const AutodllWebpackPlugin = require('autodll-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),//输出目录
        filename:'bundle.js',               //打包后的文件名
        publicPath:''                       //访问路径 
    },
    plugins:[
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.html',
        }),
        new AutodllWebpackPlugin({
            inject: true,
            filename: '[name].dll.js',
            entry:{
                utils:['isarray','is-promise']
            }
        })
    ]
}
