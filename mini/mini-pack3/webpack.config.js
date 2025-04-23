const path = require('path');
const EmitPlugin = require('./plugins/emit-plugin');
module.exports = {
  mode: 'production',
  devtool: false,
  watch: false,
  context: process.cwd(), // 上下文，如果想改变根目录，可以改这边。默认值就是当前命令执行的时候所在的目录（不是webpack.config.js的目录，是执行时的目录）
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders', 'logger-loader.js'),
        ]
      }
    ]
  },
  plugins: [
    new EmitPlugin()
  ]
}
