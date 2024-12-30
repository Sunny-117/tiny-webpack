const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [[
              path.resolve(__dirname, "babel/babel-plugin-import.js"),
              { sunnylibrary: 'lodash' }
            ]]
          }
        }
      }
    ]
  }
}
