const babylon = require('babylon');
const {Tapable} = require('tapable');
class Parser extends Tapable{
    parse(source){//可以把字符串源码转换成一个AST语法树
        let astTree =  babylon.parse(source,{
            sourceType:'module',//源代码类型是模块
            plugins:["dynamicImport"]// import('./title')
        });
        return astTree;
    }
}
module.exports = Parser;