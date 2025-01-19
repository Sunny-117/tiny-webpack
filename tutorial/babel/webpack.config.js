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
            presets: [],
            plugins: []
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
