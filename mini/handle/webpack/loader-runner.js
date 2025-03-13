let path = require('path');
let fs = require('fs');
//loader 绝对路径
function createLoaderObject(loader){
  let loaderObject = {data:{}};
  loaderObject.request = loader;//绝对路径
  loaderObject.normal = require(loader);
  loaderObject.pitch = loaderObject.normal.pitch;
  return loaderObject;
}
function runLoaders(options,finalCallback){
    let loaderContext = {};//默认是一个空对象
    let {resource,loaders}=options;
    loaders=loaders.map(createLoaderObject);
    loaderContext.loaderIndex = 0;
    //loaderContext.readResource = fs.readFile;
    loaderContext.resource = resource;
    loaderContext.loaders = loaders;
    let isSync = true;//默认是同步的
    let isDone = false;//代表是否已经调到finallCallback了
    //如果调用它就表示 当前的异步loader执行结束了,要执行下一个loader
    let innerCallback = loaderContext.callback= function(err,args){
        isSync=true;
        loaderContext.loaderIndex--;
        iterateNormalLoaders(loaderContext,args,finalCallback);
    }
    loaderContext.async = function(){
        isSync = false;//如果调用了async方法,会把状态标识从同步变成异步
        return innerCallback;
    }
    Object.defineProperty(loaderContext,'request',{
        get:function(){//loaders+resource用!连接
            return loaderContext.loaders.map(o=>o.request).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'reminingRequest',{
        get:function(){//当前索引加1开始,一直到最后
            return loaderContext.loaders.slice(loaderContext.loaderIndex+1).map(o=>o.request).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'currentRequest',{
        get:function(){//当前索引一直到最后
            return loaderContext.loaders.slice(loaderContext.loaderIndex).map(o=>o.request).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'previousRequest',{
        get:function(){//从0一直到当前索引的前一个
            return loaderContext.loaders.slice(0,loaderContext.loaderIndex).map(o=>o.request).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'data',{
        get:function(){//当前索引一直到最后
            return loaderContext.loaders[loaderContext.loaderIndex].data;
        }
    });

    iteratePitchingLoaders(loaderContext,finalCallback);

    function processResource(loaderContext,finalCallback){
        //读文件的时候没有指定编码,那么buffer就是一个Buffer的实例
        console.log(loaderContext.resource, '实际的文件路径')
        let buffer = fs.readFileSync(loaderContext.resource,'utf8');
        iterateNormalLoaders(loaderContext,buffer,finalCallback);
    }
    function iterateNormalLoaders(loaderContext,args,finalCallback){
        if(loaderContext.loaderIndex<0){//如果索引已经小于0了,则就结束
            isDone=true;
            return finalCallback(null,args);
        }
        let currrentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
        let loaderFn = currrentLoaderObject.normal;
        if(loaderFn.raw){//如果说loaderFn.raw为true
            if(!Buffer.isBuffer(args)){//如果需要buffer,但是不不是buffer,转成buffer
                args= Buffer.from(args);
            }
        }else{//需要要字符串
            if(Buffer.isBuffer(args)){
                args= args.toString('utf8');
            }
        }
        args = loaderFn.apply(loaderContext,[args]);
        if(isSync && !isDone){
            loaderContext.loaderIndex--;
            iterateNormalLoaders(loaderContext,args,finalCallback);
        }
    }
    function iteratePitchingLoaders(loaderContext,finalCallback){
        if(loaderContext.loaderIndex >= loaderContext.loaders.length){
            loaderContext.loaderIndex--;
            return processResource(loaderContext,finalCallback);
        }
        let currrentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];//loader-a
        let pitchFn = currrentLoaderObject.pitch;
        if(!pitchFn){//如果当前loaderContext没有配置pitch函数,则直接向下执行
            loaderContext.loaderIndex++;
            return iteratePitchingLoaders(loaderContext,finalCallback);
        }
        //如果有pitch就让pitchFn它执行,得到返回值
        let args = pitchFn.apply(loaderContext,
            [loaderContext.reminingRequest,
            loaderContext.previousRequest,
            currrentLoaderObject.data]);
        if(args){//如果pitch有返回值的话
            loaderContext.loaderIndex--;
            return iterateNormalLoaders(loaderContext,args,finalCallback);
        }else{//如果没有返回值,要执行下一个loader的pitch
            loaderContext.loaderIndex++;
            iteratePitchingLoaders(loaderContext,finalCallback);
        }   
    }
}

module.exports = runLoaders