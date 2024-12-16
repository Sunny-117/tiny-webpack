let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
let HappyPack = require('happypack');
let ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
module.exports = {
  mode:'development', 
  entry:'./src/index.js',
  output:{
    filename:'[name].js',
    path: path.resolve(__dirname,'dist')
  },
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  optimization:{
    splitChunks:{
      cacheGroups:{
        common:{
          chunks:'initial',
          minChunks:2,
          minSize:0
        },
        vendor:{
          test:/node_modules/, // 限制只有第三方的我要
          chunks: 'initial',
          minChunks: 2,
          minSize: 0,
          priority:10
        }
      }
    }
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:"happypack/loader?id=js",
        exclude:/node_modules/,
        include:path.resolve(__dirname,'src')
      },
      {
        test:/\.css$/,
        use:"happypack/loader?id=css"
      }
    ]
  },
  devServer:{
    contentBase:'./dist'
  },
  plugins:[
     // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
    new HappyPack({
      id:'js',
      use: ['babel-loader'],
    }),
    new HappyPack({
      id: 'css',
      use: ['style-loader', 'css-loader'],
    }),
    new DllReferencePlugin({
      manifest:path.resolve(__dirname,'dist','react.manifest.json')
    }),
    new HtmlWebpackPlugin({
      template:'./src/index.html',
    })
  ]
}
