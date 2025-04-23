const webpack = require('./lib/index.js');
const webpackOptions = require('./webpack.config.js');
// compiler代表整个编译过程
const compiler = webpack(webpackOptions);
// 调用run方法，可以启动编译

compiler.run((err, stats) => {
  // console.log(err)
  // console.log(stats.toJson())
})
