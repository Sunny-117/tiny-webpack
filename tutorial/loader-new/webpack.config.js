const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  // devtool: 'eval-source-map',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve(__dirname, './core/babel-loader.js')],
        include: path.resolve(__dirname, './src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
