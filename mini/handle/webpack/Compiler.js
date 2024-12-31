const {Tapable,SyncHook,SyncBailHook,AsyncParallelHook,AsyncSeriesHook} = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Compilation = require('./Compilation');
const Stats = require('./Stats');
const mkdirp = require('mkdirp');
const path = require('path');
class Compiler extends Tapable{
   constructor(context){
    super();
    this.options = {};
    this.hooks = {//compiler实例上还会挂载很多钩子
      //入口选项 解析入口
      //1. 能用同步的,就不要用异步
      //2. 能并行的就不要串行
      entryOption:new SyncBailHook(["context","entry"]),
      //真正的开启构建流程 e
      make:new AsyncParallelHook(["compilation"]),
      beforeRun:new AsyncSeriesHook(["compiler"]),//运行前
      run:new AsyncSeriesHook(["compiler"]),//运行
      beforeCompile:new AsyncSeriesHook(["params"]),//编译前
      compile:new SyncHook(["params"]),//编译
      thisCompilation:new SyncHook(["compilation","params"]),//开启一次新的编译
      compilation:new SyncHook(["compilation","params"]),//创建成功一次新的compilation对象
      afterCompile:new AsyncSeriesHook(["compilation"]),//编译后准备下一步 TODO
      emit:new AsyncSeriesHook(["compilation"]),//发射 生成打包后的文件
      done:new AsyncSeriesHook(["stats"])//编译完成
    }
    this.context  = context;//compiler.context=当前的工作目录
   }
   //把产出的文件写入硬盘系统  assets
   emitAssets(compilation,callback){
     //先触发emit这个钩子执行,它是最后一个可以修改产出文件的钩子
     this.hooks.emit.callAsync(compilation,err=>{
       let outputPath = this.options.output.path;
       const emitFiles = (err)=>{
         const assets = compilation.assets;
         for(let file in assets){
           let source = assets[file];//得到文件名和文件内容 
           let targetPath = path.posix.join(outputPath,file);//得到输出的路径 targetPath
           //把这个文件写入文件系统
           //outputFileSystem因为下文件不一定是fs,还有可能是memory-fs内存文件系统
           //webpack-dev-server 的时候打包的时候在硬盘上看不见文件生成 
           this.outputFileSystem.writeFileSync(targetPath,source,'utf8');//TODO 
         }
         callback();//TODO
       }
       //先保证this.options.output.path=dist目录是存在的,执行完后执行emitFiles方法
       mkdirp(outputPath,emitFiles);
     });
   }
   run(callback){
    const onCompiled = (err,compilation)=>{
      //emit发射生成 资源资产的意思 根据代块生成文件并写入到硬盘上 assets
      this.emitAssets(compilation,err=>{
        let stats = new Stats(compilation);//stats是一 个用来描述打包后结果的对象
        this.hooks.done.callAsync(stats,err=>{//done表示整个流程结束了
          callback(err,stats);
        });
      });
    }
    this.hooks.beforeRun.callAsync(this,(err)=>{//运行前
      this.hooks.run.callAsync(this,err=>{//运行
        this.compile(onCompiled);//开始编译
      });
    });
   }
   compile(onCompiled){
    const params = this.newCompilationParams();//创建参数
    this.hooks.beforeCompile.callAsync(params,(err)=>{//编译前
      this.hooks.compile.call(params);//编译
      let compilation = this.newCompilation(params);//创建一次的compilation对象 
      //make让所有的入口同时开始编译,全部编译成功后才执行onCompiled
      //make.callAsync第二个参数是一个函数,最称为最终的回调
      //所有的注册了make钩子的函数全部都成功了完成了才会触发这个回调 Promise.all([cb1,cb2]).then(1号);
      this.hooks.make.callAsync(compilation,(err)=>{//开始编译入口 1号(make成功后的回调)
        compilation.seal(err=>{//把entry入口封装成代码块chunk  => assets
          this.hooks.afterCompile.callAsync(compilation,err=>{
            return  onCompiled(err,compilation);
          });
        });
       
      });
    });
   }
   newCompilation(params){
     const compilation = new Compilation(this);
     this.hooks.thisCompilation.call(compilation,params);
     this.hooks.compilation.call(compilation,params);
    return compilation;
   }
   newCompilationParams(){
     //普通模块工厂 我们在webpack中是靠模块工厂来创建模块的
     return {
       normalModuleFactory:new NormalModuleFactory()
     }
   }
}
module.exports = Compiler;