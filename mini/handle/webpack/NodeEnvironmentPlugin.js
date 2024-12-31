
let fs = require('fs');
class NodeEnvironmentPlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.inputFileSystem = fs;//读文件和写文件都用原生node的fs模块
        compiler.outputFileSystem = fs;
    }
}
module.exports = NodeEnvironmentPlugin;