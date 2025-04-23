let { SyncHook } = require('tapable');
let Complication = require('./complication');
let fs = require('fs');

class Complier {
  constructor(options) {
    this.options = options;
    this.hooks = {// 类似run的钩子有四五十个，下面几个是比较典型的
      run: new SyncHook(), // 开始启动编译
      emit: new SyncHook(['assets']), // 会在将要写入文件的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发 全部完成
    }
  }
  run(callback) { // 开始编译
    // 4. 执行compiler对象的run方法开始编译
    /* 下面都是编译过程 */
    // 首先是触发run钩子
    this.hooks.run.call();
    // 5. 根据配置中的entry找到入口文件
    // 开启编译
    this.compile(callback);
    // 监听入口文件的变化, 如果文件变化了，重新再开始编译
    if (this.options.watch) {
      console.log('开启监听模式...')
      Object.values(this.options.entry).forEach(entry => { // 考虑到多入口
        // watch mode
        fs.watchFile(entry, () => this.compile(callback));
        console.log('文件发生变化，重新编译...')
      })
    }
    // 最后是触发done钩子
    this.hooks.done.call();
    /* 上面都是编译过程 */
    callback(null, {
      toJson() {
        return {
          files: [], // 产出哪些文件
          assets: [], // 生成哪些资源
          chunk: [], // 生成哪些代码块
          module: [], // 模块信息
          entries: [] // 入口信息
        }
      }
    })
  }
  compile(callback) {
    let complication = new Complication(this.options, this.hooks);
    complication.make(callback);
  }
}

module.exports = Complier;
