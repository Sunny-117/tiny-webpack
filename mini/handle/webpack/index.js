const Compiler = require("./Compiler");
let NodeEnvironmentPlugin = require('./NodeEnvironmentPlugin');
let WebpackOptionsApply = require('./WebpackOptionsApply');
function webpack(options){
    //如果选项里提供了上下文路径,则用配置文件里的,如果没有提供呢?就用当前工作路径
    options.context = options.context ||path.resolve(process.cwd());
    //合并配置 默认配置 配置文件webpack.config.js shell参数  npx webpack --config webpack.config.js
    let compiler = new Compiler(options.context);
    //合并compiler默认参数对象和用户传进来的配置文件进行合并
    compiler.options = Object.assign(compiler.options,options);
    //在webpack打包过程中可能会读文件和写文件 用哪个模块读写 fs,在热更新的时候, webpack-dev-server memory-fs
    new NodeEnvironmentPlugin().apply(compiler);//fs
    //挂载配置文件里配置的所有的plugins
    if(options.plugins && Array.isArray(options.plugins)){
        for(const plugin of options.plugins){
            plugin.apply(compiler);
        }
    }
    //挂载默认插件
    new WebpackOptionsApply().process(options,compiler);
    return compiler;
}
module.exports = webpack;