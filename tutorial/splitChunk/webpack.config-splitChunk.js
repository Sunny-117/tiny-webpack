const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  optimization: {
    splitChunks: {
      // 表示选择哪些 chunks 进行分割，可选值有：async，initial和all
      chunks: 'all',
      // 表示新分离出的chunk必须大于等于minSize，默认为30000，约30kb。
      minSize: 0,//默认值是20000,生成的代码块的最小尺寸
      // 表示一个模块至少应被minChunks个chunk所包含才能分割。默认为1。
      minChunks: 1,
      // 表示按需加载文件时，并行请求的最大数目。默认为5。
      maxAsyncRequests: 3,
      // 表示加载入口文件时，并行请求的最大数目。默认为3
      maxInitialRequests: 5,
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: false,
        default: false,
        common: {
          minChunks: 1,
          reuseExistingChunk: false
        }
      }
    },
    runtimeChunk: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ]
}
