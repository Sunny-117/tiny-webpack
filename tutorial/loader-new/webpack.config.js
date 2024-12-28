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
      {
        test: /\.(png|jpg)$/,
        use: [{
            loader: path.resolve('./core/file-loader.js'),
            options: {
              name: '[hash:8].[ext]',
              esModule: false
            }
        }],
        include: path.resolve(__dirname, './src')
      },
      // {
      //   test: /\.png$/,
      //   use: [{
      //       loader: path.resolve('./core/url-loader.js'),
      //       options: {
      //         name: '[hash:8].[ext]',
      //         limit: 8*1024,
      //         // fallback: path.resolve('./core/file-loader.js')
      //       }
      //   }],
      //   include: path.resolve(__dirname, './src')
      // }
      {
        test: /\.less$/,
        // use: ['style-loader', 'css-loader', 'less-loader'],
        use: [
          path.resolve(__dirname, './core/css/style-loader'),
          path.resolve(__dirname, './core/css/less-loader'),
        ],
        include: path.resolve(__dirname, './src')
      },
      {
        test: /\.css$/,
        use: [
          path.resolve(__dirname, './core/css/style-loader.js'),
          {
            loader: path.resolve(__dirname, './core/css/css-loader.js'),
            options: {
              url: true,//是否解析url()
              import: true,//是否解析@import语法
              esModule: false,//不包装成ES MODULE，默认是common.js导出
              importLoaders:2//在处理导入的CSS的时候，要经过几个前置loader的处理
            }
          },
          path.resolve(__dirname, "./core/logger2-loader"),
          path.resolve(__dirname, "./core/logger1-loader"),
        ],
        include: path.resolve('src')
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: path.resolve(__dirname, './core/css/css-loader.js'),
            options: {
              url: false,//是否解析url()
              import: true,//是否解析@import语法
              esModule: false,//不包装成ES MODULE，默认是common.js导出
              importLoaders: 1//在处理导入的CSS的时候，要经过几个前置loader的处理
            }
          },
          'less-loader'
        ],
        include: path.resolve('src')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/test/css-loader/index.html'
    })
  ]
}
