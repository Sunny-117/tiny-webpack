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
                  browsers: ['last 2 version', 'safari 7']
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
                  // https://www.babeljs.cn/docs/babel-runtime
                  /**
                   * false: 产物中function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_7___default()(e, "prototype", { writable: !1 }), e; }有两份
                   * true: 产物中function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), _babel_runtime_corejs2_core_js_object_define_property__WEBPACK_IMPORTED_MODULE_7___default()(e, "prototype", { writable: !1 }), e; }只有一份
                   */
                  helpers: true, // 抽取公共方法
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
