// 使用动态链接库文件
const path = require("path");
const DllReferencePlugin = require("webpack/lib/DllReferencePlugin.js");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new DllReferencePlugin({
      manifest: require("./dist/utils.manifest.json"),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
};
