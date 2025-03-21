const { ExternalModule } = require("webpack");

/**
 * 在本插件我们做什么，分成二步
 * 1.判断一下，查找一下本项目是否用到了某些模块
 * 2.改造生产模块的过程，如果这个模块配置为外部模块，就不需要打包了，会走外部模块流程，如果没有配置，就走正常的打包流程
 */
class AutoExternalPlugin {
  constructor(options) {
    this.options = options;
    this.importedModules = new Set();//[jquery,lodash]
  }
  apply(compiler) {
    //普通模块工厂是用来创建普通模块的
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin', (normalModuleFactory) => {
      normalModuleFactory.hooks.parser
        .for('javascript/auto') // 拿到javascript/auto的parser
        .tap('AutoExternalPlugin', parser => {//babel esprima acorn
          parser.hooks.import.tap('AutoExternalPlugin', (statement, source) => {
            this.importedModules.add(source);//jquery
          });
          parser.hooks.call.for('require').tap('AutoExternalPlugin', (expression) => {
            let value = expression.arguments[0].value;
            this.importedModules.add(value);//lodash
          });
        });
      //在normalModuleFactory内部，真正的生产模块的方法就是factory方法
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin', (resolveData, callback) => {
        let request = resolveData.request;// ./src/index.js
        if (this.importedModules.has(request)) {
          let variable = this.options[request].expose;// $
          callback(null, new ExternalModule(variable, 'window', request));
        } else {
          callback(null);
        }
      });
    })
  }
}


module.exports = AutoExternalPlugin;


// 要想监听 import 和require
// 1.通过Compiler获取到normalModuleFactory
// 2.通过normalModuleFactory的parser钩子获取 parer
// 3.通过parer的import获取import语句
// 4.通过parer的call获取 require语句