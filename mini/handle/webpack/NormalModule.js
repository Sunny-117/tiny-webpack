let path = require('path');
let fs = require('fs');
const types = require('babel-types');
const async = require('neo-async');
const runLoaders = require('./loader-runner');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
class NormalModule{
    constructor({name,context,rawRequest,resource,parser,async,moduleId}){
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;//模块的完整绝对路径 
        this.parser = parser;
        
        this._source=null;//源代码 先从硬盘上把源代码读出来
        this._ast = null;//AST抽象语法树 然后转成抽象语法树

        this.moduleId=moduleId;//模块ID
        this.dependencies = [];//此模块依赖的模块数组 TODO 同步依赖 require 同步依赖

        this.async = async;//同步异步标志一路往下传
        this.blocks= []; //异步依赖 import方法调用 异步依赖
    }
    build(compilation,callback){
        this.doBuild(compilation,err=>{
            debugger
            //先把源代码转成抽象语法树
            let ast = this.parser.parse( this._source);
            //分析依赖require import 依赖
            traverse(ast,{
                CallExpression:(nodePath)=>{
                    let node = nodePath.node;
                    if(node.callee.name === 'require'){//说明一个require方法调用
                        node.callee.name='__webpack_require__';
                        let moduleName = node.arguments[0].value;// ./title lodash
                        let depResource;
                        if(moduleName.startsWith('.')){//如果模块名称是以.开头的 说明是一个本地模块
                            //如果这个模块名称有后续,则不需要额外添加了,如果没有,则需要额外添加一个.js后续方便查看文件
                            let extension = moduleName.split(path.posix.sep).pop().indexOf('.')==-1?'.js':'';
                            //然后我要获取 到依赖模块的绝对路径
                            depResource = path.posix.join(
                                path.posix.dirname(this.resource),//当前模块的所在目录
                                moduleName+extension//依赖的模块的相对路径
                            );
                        }else{
                            //loadsh 
                            //./node_modules/_lodash@4.17.19@lodash/lodash.js
                            //require.resolve解析路径 main index.js
                            depResource = require.resolve(path.posix.join(
                                this.context,
                                'node_modules',
                                moduleName
                            ));
                            depResource = depResource.replace(/\\/g,path.posix.sep);
                        }
                       
                        //再获取依赖模块的模块ID
                        //let depModuleId = '.'+path.posix.sep+path.posix.relative(this.context,depResource);
                        let depModuleId = '.'+depResource.slice(this.context.length);
                        //depModuleId ./node_modules/lodash
                        this.dependencies.push({
                            name:this.name,//当前模块和它依赖的模块都属性同一个代码块,名称相同
                            context:this.context,
                            rawRequest:moduleName,// ./title
                            moduleId:depModuleId,//模块ID,也就是相对根目录的相对路径
                            resource:depResource,//模块的绝对路径
                        });
                        //修改此节点参数的名称为 depModuleId 依赖模块ID
                        node.arguments = [types.stringLiteral(depModuleId)];
                    }else  if(types.isImport(nodePath.node.callee)){//就是一个import 方法调用
                        let moduleName = node.arguments[0].value;//获取到要加载的模块的名字
                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.')==-1?'.js':'';//扩展名
                        let depResource = path.posix.join(//获取这个模块的绝对路径
                            path.posix.dirname(this.resource),//当前模块的所在目录
                            moduleName+extension//依赖的模块的相对路径
                        );//生成异步加载模块ID ./ 从根目录出发到此模块的绝对路径的相对路径
                        let depModuleId = '.'+path.posix.sep+path.posix.relative(this.context,depResource);
                        //异步加载的话要生成一个新的代码块,实现代码分割
                        //一般会拿 模块的ID ./src/title.js src/title.js src/title src_title 这样的话不同目录下的title.js就不会重复了
                        //默认情况下代码块的名称是索引,如果给了webpackChunkName的话就是给的名称  src_title
                        let depChunkId =depModuleId.slice(2,depModuleId.lastIndexOf('.')).replace(path.posix.sep,'_','g');  
                        nodePath.replaceWithSourceString(`__webpack_require__.e("${depChunkId}").then(__webpack_require__.t.bind(null,"${depModuleId}", 7))`);
                        this.blocks.push({//加入异步依赖
                            context:this.context,//根目录
                            entry:depModuleId,//入口模块ID 也是模块的路径
                            name:depChunkId,//代码块的名称
                            async:true//异步加载过来的
                        });    
                    }
                }
            });
            let {code}= generate(ast);
            this._source = code;
            this._ast = ast;
            //遍历blocks数组,针对每一个block都当成一个入口模块来处理进行编译,当所有的block都编译完成,才会让自己这个模块编译完成
            async.forEach(this.blocks,({context,entry,name,async},done)=>{
                compilation._addModuleChain(context,entry,name,async,done)
            },callback);
        });
    }
    doBuild(compilation,callback){
        this.getSource(compilation,(err,data)=>{
            this._source= data;//把从硬盘上读取的源码放在模块的 _source属性上
            callback();//把代码转成抽象语法树
        });
    }
    getSource(compilation,callback){
       
        //走load-runner compilation.inputFileSystem = fs  fs.readFile
        //compilation.inputFileSystem.readFile(this.resource,'utf8',callback);
        let {module:{rules}}= compilation.options;
        let loaders = [];
        for(let i=0;i<rules.length;i++){
            let rule = rules[i];
            if(rule.test.test(this.resource)){
                let useLoaders = rule.use;
                loaders = [...loaders,...useLoaders];
            }
        }
        //loaders=['style-loader','less-loader']
        loaders = loaders.map(loader=>require.resolve(path.posix.join(this.context,'loaders',loader)));
        debugger
        runLoaders({
            resource:this.resource,//要加载的模块的绝对路径
            loaders,//loader的绝地路径的数组
        },callback);
    }
}
module.exports = NormalModule;