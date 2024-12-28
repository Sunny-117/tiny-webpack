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
      },
      // {
      //   test: /\.png$/,
      //   use: [{
      //       loader: path.resolve('./core/file-loader.js'),
      //       options: {
      //         name: '[hash:8].[ext]',
      //         esModule: false
      //       }
      //   }],
      //   include: path.resolve(__dirname, './src')
      // }
      {
        test: /\.png$/,
        use: [{
            loader: path.resolve('./core/url-loader.js'),
            options: {
              name: '[hash:8].[ext]',
              limit: 8*1024,
              // fallback: path.resolve('./core/file-loader.js')
            }
        }],
        include: path.resolve(__dirname, './src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
