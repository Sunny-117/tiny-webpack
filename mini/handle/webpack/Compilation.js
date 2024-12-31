const {Tapable,SyncHook} = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const async = require('neo-async');//并发执行异步任务 Promise.all();
const Parser  = require('./Parser');
const path  = require('path');
const Chunk = require('./Chunk');
const ejs = require('ejs');//模板引擎 ,是用来生成代码的
const fs = require('fs');//读取文件内容的模块
const mainTemplate = fs.readFileSync(path.join(__dirname,'templates','main.ejs'),'utf8');
const mainRender = ejs.compile(mainTemplate);//通过compile把模板内容编译成一个渲染函数
const chunkTemplate = fs.readFileSync(path.join(__dirname,'templates','chunk.ejs'),'utf8');
const chunkRender = ejs.compile(chunkTemplate);//通过compile把模板内容编译成一个渲染函数
const parser = new Parser();
class Compilation extends Tapable{
    constructor(compiler){
        super();
        this.compiler = compiler;//编译器
        this.options = compiler.options;//选项对象
        this.context = compiler.context;//项目根目录
        this.inputFileSystem = compiler.inputFileSystem;//输入文件系统
        this.outputFileSystem = compiler.outputFileSystem;//输出文件系统
        this.entries= [];//放着入口模块
        this.modules=[];//所以打包进来的模块
        this._modules = {};//key就模块ID 值是模块对象
        this.chunks = [];//这里放着本次编译产生的所有代码块
        this.files = [];//这里放里所有的产出的文件 只有文件名 Object.keys(this.assets )
        this.assets = {};//这里放着所有生成的资源 key文件名 值是文件内容 
        this.vendors = [];//把第三方的模块放在这里
        this.commons= [];//把是第三方的,不同的页面共享 的次数大于等2的模块放在这里
        this.commonsCountMap={};//用来计算模块被引用的次数
        this.hooks={
            //当一个模块依赖成功后会执行这个钩子
            succeedModule:new SyncHook(["module"]),
            seal:new SyncHook(),//开始准备封装chunk
            beforeChunks:new SyncHook([]),//准备生成chunk之前
            afterChunks:new SyncHook(["chunks"])//生成chunks之后
        }
    }
    //context=C:\anormal\sunny\5.hand\ ./src/index.js name chunk的名称
    //callback 当这个入口编译完成后会执行回调,表示这个入口编译完成
    addEntry(context,entry,name,async,callback){
        this._addModuleChain(context,entry,name,async,(err,module)=>{
            callback(err,module);
        });
    }
    _addModuleChain(context,entry,name,async,callback){
        this.createModule({
            name,//所属的代码块的名称 main
            context:this.context,//上下文
            rawRequest:entry,// ./src/index.js
            resource:path.posix.join(context,entry),//此模块entry的的绝对路径
            parser,
            async
        },module=>{this.entries.push(module)},callback);
    }
    createModule(data,addEntry,callback){
        //先创建模块工厂
        const moduleFactory = new NormalModuleFactory();
        let module = moduleFactory.create(data);
        //非常非常重要 模块的ID如何生成? 模块的ID是一个相对于根目录的相对路径
        //index.js ./src/index.js title.js ./src/title.js
        //relative返回一个相对路径 从根目录出出到模块的绝地路径 得到一个相对路径
        //如果是一个普通模块的话是 本地模块的话没问题
        //module.moduleId = '.'+path.posix.sep+path.posix.relative(this.context,module.resource);
        module.moduleId = '.'+module.resource.slice(this.context.length);//TODO2
        this._modules[module.moduleId]=module;
        addEntry&&addEntry(module);
        this.modules.push(module);//把模块添加到完整的模块数组中
        const afterBuild = (err,module)=>{//TODO2
            if(module.dependencies.length>0){//如果一个模块编译完成,发现它有依赖的模块,那么递归编译它的依赖模块
                this.processModuleDependencies(module,(err)=>{
                    //当这个入口模块和它依赖的模块都编译完成了,才会让调用入口模块的回调
                    callback(err,module);
                });
            }else{
                callback(err,module);
            }
        }
        this.buildModule(module,afterBuild);
    }
    processModuleDependencies(module,callback){
        let dependencies= module.dependencies;
        //因为我希望可以并行的同时开始编译依赖的模块,然后等所有依赖的模块全部编译完成后才结束
        async.forEach(dependencies,(dependency,done)=>{
            let {name,context,rawRequest,resource,moduleId} = dependency;
            this.createModule({
                name,
                context,
                rawRequest,
                resource,
                moduleId,
                parser
            },null,done);
        },callback);
    }
    buildModule(module,afterBuild){
        module.build(this,(err)=>{
            this.hooks.succeedModule.call(module)
            afterBuild(null,module);
        });
    }
    seal(callback){
        this.hooks.seal.call();//触发seal的钩子执行
        this.hooks.beforeChunks.call();//生成代码块chunk之前
        //在生成chunk之前的分类
        for(const module of this.modules){
            //如果路径里有node_modules的话就说明第三方的
            if(/node_modules/.test(module.moduleId)){ //模块去重
                module.name = 'vendor';
                let oldModule = this.vendors.find(item=>item.moduleId==module.moduleId);
                if(!oldModule)
                    this.vendors.push(module);//lodash  TODO2
            }else{//累计每个模块引用的次数
                if(this.commonsCountMap[module.moduleId]){//title
                    this.commonsCountMap[module.moduleId].count++; //TODO2
                }else{
                    this.commonsCountMap[module.moduleId]={count:1,module}
                }
            }
        }
        for(let moduleId in this.commonsCountMap){
            let {module,count} = this.commonsCountMap[moduleId];
            if(count>=2){
                module.name ='commons';//
                this.commons.push(module);//title
            } 
        }
        let exactedModuleIds = [...this.vendors,...this.commons].map(item=>item.moduleId);//[lodash,title]
        this.modules = this.modules.filter(module=>exactedModuleIds.indexOf(module.moduleId)==-1);

        for(const entryModule of this.entries){//entries 代表入口模块,每个入口模块和它依赖的模块会生成一个代码块
            const chunk = new Chunk(entryModule);//根据入口模块生成代码块 chunk.async=true
            this.chunks.push(chunk);//把chunk添加到this.chunks里去进行保存
            chunk.modules = this.modules.filter(module=>module.name == chunk.name);//把模块进行过滤,模块名称相同的都放到这个代码块的modules里去
        }
        if(this.vendors.length>0){
            const chunk = new Chunk(this.vendors[0]);
            chunk.async = true;
            this.chunks.push(chunk);
            chunk.modules = this.vendors;
        }
        if(this.commons.length>0){
            const chunk = new Chunk(this.commons[0]);
            chunk.async = true;
            this.chunks.push(chunk);
            chunk.modules = this.commons;
        }
        this.hooks.afterChunks.call(this.chunks);//生成代码块后
        //在生成代码块之后就要生成要写入硬盘的文件了
        this.createChunkAssets();
        callback();
    }
    createChunkAssets(){
        for(let i=0;i<this.chunks.length;i++){
            const chunk = this.chunks[i];
            chunk.files = [];//每个代码块有自己的files
            const file = chunk.name +'.js';//得到文件名 代码块的名称.js main.js
            let source;
            if(chunk.async){//大家可以试一试,如果这个地方不用模板引擎 ,你应如何实现?
                source = chunkRender({
                    chunkName:chunk.name,//入口模块ID
                    modules:chunk.modules //模块的数组 main a b
                });
            }else{
                source = mainRender({
                    entryId:chunk.entryModule.moduleId,//入口模块ID
                    modules:chunk.modules //模块的数组 main a b
                });
            }
            chunk.files.push(file);//mainChunk.files=[main.js]; 只有一个chunk的文件
            this.emitAsset(file,source);
        }
    }
    emitAsset(file,source){
        this.assets[file]= source;//compilation.assets[file]=source
        this.files.push(file);//compilation.files=[main.js] 所有chunk的文件都在这里
    }
}

module.exports = Compilation;