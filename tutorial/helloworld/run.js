const webpack = require('webpack');
const options = require('./webpack.config');
const compiler = webpack(options);
//开启动编译,编译完成后会执行回调函数
debugger
compiler.run((err,stats)=>{
    console.log(err);//错误对象
    console.log(stats.toJson({
        entries:true,//输出入口信息
        chunks:true,//输出代码块信息
        modules:true,//输出模块信息
        _modules:true,//输出模块信息
        assets:true //输出打包出来的资源信息
    }));//status 保存输出的信息 编译的信息
});


