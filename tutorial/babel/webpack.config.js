const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: false,
  output: {
      path: resolve(__dirname, 'dist'),
      filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve(__dirname, 'src'),
        use: [{
          loader: 'babel-loader',
          options: {
            // TODO: presets和plugins什么时候使用？配合使用？
            presets: [
              ['@babel/preset-env',
              {
                /**
                 * 取值：
                 * false: 不自动引入
                 * entry: 在入口文件中引入 entry: ['@babel/polyfill', './src/index.js']
                 * usage: 按需加载
                 */
                useBuiltIns: 'usage',
                targets: {
                  node: 'current',
                  chrome: 52,
                  browsers: ['last 2 versions', '> 1%']
                }
              }
            ]
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 2, // 自动引入
                  // corejs: false, // 没有polyfill
                  helper: false, // 抽取公共方法 TODO：验证效果
                  regenerator: false // 重写生成器方法
                }
              ]
            ]
          }
        }]
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
