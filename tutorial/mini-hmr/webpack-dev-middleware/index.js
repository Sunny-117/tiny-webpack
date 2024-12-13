/**
 * webpack开发中间件
 * 1.真正的以监听模式启动webpack的编译
 * 2.返回一个express中间件，用来预览我们产出的资源文件
 * @param {*} compiler 
 */
const MemoryFileSystem = require('memory-fs');
const fs = require('fs');
// 通过“memory-fs”库将打包后的文件写入内存
const memoryFileSystem = new MemoryFileSystem();
const middleware = require('./middleware');
function webpackDevMiddleware(compiler) {
  // 首先对本地文件代码进行编译打包，也就是webpack的一系列编译流程。
  // 其次编译结束后，开启对本地文件的监听，当文件发生变化，重新编译，编译完成之后继续监听。

  // 为什么代码的改动保存会自动编译，重新打包？这一系列的重新检测编译就归功于compiler.watch这个方法了。监听本地文件的变化主要是通过文件的生成时间是否有变化，
  //1.真正的以监听模式启动webpack的编译
  compiler.watch({}, () => {
    console.log('监听到文件变化，webpack重新开始编译');
  });
  //7.设置文件系统为内存文件系统
  //产出的文件并不是写在硬盘上了，为提供性能，产出的文件是放在内存里，所以你在硬盘上看不见
  //当webpack准备写入文件的时候，是用的compiler.outputFileSystem来写入
  // let fs = compiler.outputFileSystem = memoryFileSystem;
  return middleware({
    fs,
    outputPath: compiler.options.output.path//写入到哪个目录里去
  });

}
module.exports = webpackDevMiddleware;
