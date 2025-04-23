const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser'); // 编译
const traverse = require("@babel/traverse").default; // 转换
const generator = require('@babel/generator').default; // 生成 新源码
const baseDir = toUnitPath(process.cwd()); // process.cwd()表示当前文件所在绝对路径，toUnitPath(路径)将路径分隔符统一转成正斜杠/

class Complication { // 一次编译会有一个complication,会存放所有入口
  constructor(options, hooks) {
    this.options = options;
    this.hooks = hooks;
    // 下面这些 webpack4中都是数组  但是webpack5中都换成了set，优化了下，防止重复的资源编译,当然数组也可以做到防止重复资源编译
    this.entries = []; // 存放所有的入口
    this.modules = []; // 存放所有的模块
    this.chunks = []; // 存放所有的代码块
    this.assets = {}; // 对象，key为文件名，value为文件编译后的源码，存放所有的产出的资源, this.assets就是文件输出列表
    this.files = []; // 存放所有的产出的文件
  }
  make(callback) {
    // 5. 根据配置中的entry找出入口文件
    let entry = {};
    if (typeof this.options.entry === 'string') {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    // entry = {entry1: "./src/entry1.js", entry2: './src/entry2.js'}
    for (let entryName in entry) {
      // 获取入口文件的绝对路径，这里的this.options.context默认是process.cwd()，这个默认值在这边没做处理
      let entryFilePath = toUnitPath(path.join(this.options.context, entry[entryName]))
      // 6.从入口文件出发，调用所有配置的Loader对模块进行编译,返回一个入口模块
      let entryModule = this.buildModule(entryName, entryFilePath);
      // // 把入口module也放到this.modules中去
      // this.modules.push(entryModule);
      // 8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
      let chunk = {
        name: entryName,
        entryModule,
        modules: this.modules.filter(item => item.name === entryName)
      };
      this.entries.push(chunk); // 代码块会放到entries和chunks中
      this.chunks.push(chunk); // 代码块会放到entries和chunks中
      // 9.再把每个Chunk转换成一个单独的文件加入到输出列表
      this.chunks.forEach(chunk => {
        let filename = this.options.output.filename.replace('[name]', chunk.name);
        // 这个this.assets就是文件输出列表, key为文件名，value为chunk的源码
        this.assets[filename] = getSource(chunk); // assets中key为文件名，value为chunk的源码
      })
      // 10.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
      this.files = Object.keys(this.assets);
      this.hooks.emit.call(this.assets)
      for (let fileName in this.assets) {
        let filePath = path.join(this.options.output.path, fileName);
        fs.writeFileSync(filePath, this.assets[fileName], 'utf8');
      }
      // 最后调用callback，返回一个对象，对象内有toJSON方法
      callback(null, {
        toJson: () => {
          return {
            entries: this.entries,
            chunks: this.chunks,
            modules: this.modules,
            files: this.files,
            assets: this.assets
          }
        }
      });

    }

  }
  buildModule(name, modulePath) { // 参数第一个是代码块的名称，第二个是模块的绝对路径
    // 6.从入口文件出发，调用所有配置的Loader对模块进行编译,返回一个入口模块
    // 6.1 读取模块文件内容
    let sourceCode = fs.readFileSync(modulePath, 'utf-8');
    let rules = this.options.module.rules;
    let loaders = []; // 寻找匹配的loader
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].test.test(modulePath)) { // 如果当前文件路径能够匹配上loader的正则的，那么就调用这个loader去处理
        loaders = [...loaders, ...rules[i].use]
      }
    }
    // 用loader进行转换，从右往左，从下往上,在这里就是数组从右往左
    for (let i = loaders.length - 1; i >= 0; i--) {
      let loader = loaders[i];
      sourceCode = require(loader)(sourceCode, name, modulePath)
    }
    // 7. 再找出该模块依赖的模块，再递归这个步骤，知道所有入口依赖的文件都经过了这个步骤的处理，得到入口与模块之间的依赖关系
    let moduleId = './' + path.posix.relative(baseDir, modulePath); // 当前模块的id
    let module = {
      id: moduleId, // 模块id，也就是相对于项目根目录的相对路径
      dependencies: [], // 模块依赖
      name // 模块名称
    }
    let ast = parser.parse(sourceCode, { sourceType: 'module' }); // 生成语法树
    traverse(ast, {
      // CallExpression这个节点代表方法调用
      CallExpression: ({ node }) => {
        if (node.callee.name === 'require') {
          let moduleName = node.arguments[0].value; // 获取require函数的参数 './title',也就是模块的相对路径
          let dirname = path.posix.dirname(modulePath); // 获取模块的所在目录(title文件的父文件夹) path.posix相当于把路径都转成/，不论是什么系统，都是正斜杠,如果不用posix的话，linux是正斜杠，windows是反斜杠
          let depModulePath = path.posix.join(dirname, moduleName); // 模块的绝对路径,但是可能没有后缀，
          let extensions = this.options.resolve.extensions; // 如果options中没有配置resolve，需要做判断，这边就暂时不写了
          depModulePath = tryExtensions(depModulePath, extensions); // 生成依赖的模块绝对路径，已经包含了扩展名了
          // 找到引用的模块的id,引用的模块的id的特点是：相对于根目录的路径
          let depModuleId = './' + path.posix.relative(baseDir, depModulePath);
          node.arguments = [types.stringLiteral(depModulePath)]; // 这个就是参数这个节点要变，因为原来是require('./title'),现在要变成require('./src/title.js'),这个types.stringLiteral就是用来修改参数的
          let alreadyImportedModuleIds = this.modules.map(item => item.id); // 遍历出已有的modules的moduleId
          // 把依赖模块的绝对路径放到依赖数组里面
          // if (!alreadyImportedModuleIds.includes(dependency.depModuleId)) { // 如果不存在，才放进this.modules数组，这样防止已经编译过的模块重复放到this.modules中
          module.dependencies.push({ depModuleId, depModulePath });
          // }

        }
      }
    })
    let { code } = generator(ast);
    // console.log(code, toUnitPath(this.options.context));
    module._source = code.replace(toUnitPath(this.options.context), '.');// 模块源代码指向语法树转换后的新生村的源代码
    // 7. 再找出该模块依赖的模块，再递归这个步骤，知道所有入口依赖的文件都经过了这个步骤的处理，得到入口与模块之间的依赖关系 这时候需要开始递归了
    module.dependencies.forEach(dependency => {
      let depModule = this.modules.find(item => item.id === dependency.depModuleId);
      // 判断模块是否已经被编译过了，如果编译过了直接push，如果没有编译过，那么就先编译，编译完了再push
      if (depModule) {
        this.modules.push({ ...depModule, name }); // 重新改下名字
      } else {
        let dependencyModule = this.buildModule(name, dependency.depModulePath); // 这个name为啥是一样的？？？？？？
        this.modules.push(dependencyModule);
      }
    })

    return module;
  }
}

function tryExtensions(modulePath, extensions) {
  extensions.unshift('');// 为什么要加一个空串，因为有可能用户写的路径是带后缀的，所以路径跟空串结合就是路径，如果不加空串，用户如果路径带了后缀，那判断就是title.js.js title.js.jsx title.js.json
  for (let i = 0; i < extensions.length; i++) {
    let filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error('Module not found')
}
function toUnitPath(modulePath) {
  return modulePath.replace(/\\/g, '/');
}
function getSource(chunk) {
  return `
  (() => {
      var modules = ({
          ${chunk.modules.map(module => `
                  "${module.id}":(module,exports,require)=>{
                      ${module._source}
                  }
              `).join(',')
    }
      });
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = cache[moduleId] = {
          exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports = {};
      (() => {
       ${chunk.entryModule._source}
      })();
    })()
      ;
  `
}
module.exports = Complication;
