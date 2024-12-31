
class SingleEntryPlugin{
    /**
     * @param {*} context 根目录  C:\anormal\sunny\5.hand
     * @param {*} entry  入口路径 ./src/index.js
     * @param {*} name  入口的名称  main
     */
    constructor(context,entry,name){
        this.context = context;
        this.entry = entry;
        this.name = name;
    }
    apply(compiler){
        //监听make事件                                       0号(表示一个钩子函数完成了)
        compiler.hooks.make.tapAsync('SingleEntryPlugin',(compilation,callback)=>{//2号(make钩子函数1)
            //从入口模块开始编译
            compilation.addEntry(this.context,this.entry,this.name,false,callback);
        });
    }
}

module.exports = SingleEntryPlugin;