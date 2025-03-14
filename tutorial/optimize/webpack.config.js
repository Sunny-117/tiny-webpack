const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode:'development',//选择生产环境的话,会默认进行压缩
    devtool:false,
    //MPA多页应用 多入口
    entry:'./src/index.js', 
    // chunkHash：入口对应的模块没有变化，就不会变。缓存时间更长。缺点：如果有一个模块变了，所有的入口都会变【比如只改了./src/index.js，bundle出来的css也会变，因为是一个hash】
    // contentHash：模块本身的内容不变，hash就不变。缺点：如果有一个模块变了，所有的入口都会变

   /*  entry:{
        k1:'./src/k1.js',
        k2:['m1','m2']
    }, */
    output:{
      // 1. 默认hash
      //  filename:'[name].js',
      //  chunkFilename:'[name].js'
      // 2. chunkhash
      filename: '[name].[chunkhash:5].js',
      // 3. contenthash
      // filename: '[name].[contenthash:5].js',
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:[
                                //1.modules:false告诉 babel不要转换模块代码,为了tree-shaking
                                ["@babel/preset-env",{modules:false}]
                            ]
                        }
                    }
                ]
            },
            {
                test:/\.css$/,
                use:[
                    MiniCssExtractPlugin.loader,//收集CSS内容
                    "css-loader"
                ]
            }
        ]
    },
    plugins:[
        //contenthash 只跟内容有关系,只要内容不变,它就不变
        new MiniCssExtractPlugin({
            filename:'[name].[contenthash:5].css',//负责写入文件
            // filename:'[name].[chunkhash:5].css',//负责写入文件
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            inject:'head'
        }),
        new CleanWebpackPlugin()
    ]
}
