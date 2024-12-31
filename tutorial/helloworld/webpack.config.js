const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // devtool: 'source-map',
  devtool: false,
  output: {
      path: resolve(__dirname, 'dist'),
      filename: 'bundle.js',
  },
  plugins: [
      new HtmlWebpackPlugin({
          template: './src/index.html',
      }),
      new CleanWebpackPlugin()
  ],
}
