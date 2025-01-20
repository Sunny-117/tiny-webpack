const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetPlugin = require('./assets-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // stats: 'none',
  mode: 'development',
  devtool: false,
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
    page3: "./src/page3.js",
  },
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
      chunks: 'all',
      // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
      minSize: 0,//默认值是20000,生成的代码块的最小尺寸
      // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
      minChunks: 2,
      // 表示按需加载文件时，并行请求的最大数目。默认为5。
      maxAsyncRequests: 3,
      // 表示加载入口文件时，并行请求的最大数目。默认为3
      maxInitialRequests: 5,
      name: true, // 打包的名称，默认是chunk的名字 通过用automaticNameDelimiter分割
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: '~',
      cacheGroups: {
        // 因为某个模块可能满足多个缓存组，所以需要有优先级的概念
        defaultVendors: {
          chunks: 'initial', // 分割的是同步的代码块
          test: /[\\/]node_modules[\\/]/, //条件
          priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
          // 为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
        },
        // default: {
        //   minChunks: 2,////被多少模块共享,在分割之前模块的被引用次数
        //   priority: -20
        // },
        commons: {
          chunks: 'initial',
          minSize: 0,
          minChunks: 2, // 最少被两个chunk引用，才会被提取
          priority: -20,
          reuseExistingChunk: true // 如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
        }
      },
    },
    runtimeChunk: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'page1.html',
    
      chunks: ["page1"], // 包含的代码块
      // 也可以
      // excludeChunks: ['page2', 'page3'] // 只要page1的代码块
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ["page2"],
      filename: 'page2.html',
      // excludeChunks: ['page1', 'page3'] // 只要page2的代码块
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ["page3"],
      filename: 'page3.html',
      // excludeChunks: ['page1', 'page2'] // 只要page3的代码块
    }),
    new AssetPlugin(),
    new CleanWebpackPlugin()
  ]
})
