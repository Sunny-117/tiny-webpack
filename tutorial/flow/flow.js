let fs = require('fs');
let path = require('path');
const { SyncHook } = require("tapable");

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(),
      done: new SyncHook(),
    };
  }
  run() {
    this.hooks.run.call();  
    let modules = [];
    let chunks = [];
    let files = [];
    // 确定入口：根据配置中的entry找出所有的入口文件
    let entry = path.join(this.options.context, this.options.entry);
    //从入口文件出发，调用所有配置的Loader对模块进行编译，
    let entryContent = fs.readFileSync(entry, "utf8");
    let entrySource = babelLoader(entryContent);
    let entryModule = { id: entry, source: entrySource };
    modules.push(entryModule);
    //再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    let title = path.join(this.options.context, "./src/title.js");
    let titleContent = fs.readFileSync(title, "utf8");
    let titleSource = babelLoader(titleContent);
    let titleModule = { id: title, source: titleSource };
    modules.push(titleModule);
    //根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
    let chunk = { name: "main", modules };
    chunks.push(chunk);
    //再把每个Chunk转换成一个单独的文件加入到输出列表
    let file = {
      file: this.options.output.filename,
      source: `
(function (modules) {
   function __webpack_require__(moduleId) {
     var module = { exports: {} };
     modules[moduleId].call(
     module.exports,
     module,
     module.exports,
     __webpack_require__
     );
     return module.exports;
   }
   return __webpack_require__("./src/app.js");
 })(
{
 "./src/app.js": function (module, exports, __webpack_require__) {
     var title = __webpack_require__("./src/title.js");
     console.log(title);
 },
 "./src/title.js": function (module) {
     module.exports = "title";
 },
});
`,
    };
    files.push(file);
    //在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
    let outputPath = path.join(
      this.options.output.path,
      this.options.output.filename
    );
    fs.writeFileSync(outputPath, file.source,'utf8');
      this.hooks.done.call();  
  }
}
//1.从配置文件和Shell语句中读取与合并参数，得出最终的参数
let options = require('./webpack.config');
//2.用上一步得到的参数初始化Compiler对象
let compiler = new Compiler(options);
//3.加载所有配置的插件
if (options.plugins && Array.isArray(options.plugins)) {
  for (const plugin of options.plugins) {
   plugin.apply(compiler);
  }
}
//4.执行对象的run方法开始执行编译
compiler.run();
function babelLoader(source) {
  return `var sum = function sum(a, b) {
              return a + b;
            };`;
}
