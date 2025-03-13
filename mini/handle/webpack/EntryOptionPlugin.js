let SingleEntryPlugin = require('./SingleEntryPlugin');
class EntryOptionPlugin {
    apply(compiler){
        //当有一个entryOption事件钩子触发的时候,会执行回调,并传入context和entry
        //context永远指向当前的根目录 entry ./src/index.js
        compiler.hooks.entryOption.tap('EntryOptionPlugin',(context,entry)=>{
            //我们的entry可以有是一个字符串,也可能是一个对象
            if(typeof entry === 'string'){
                    new SingleEntryPlugin(context,entry,'main').apply(compiler);
            }else{
              /**
               * 多入口
               */
                for(let entryName in entry){
                    new SingleEntryPlugin(context,entry[entryName],entryName).apply(compiler);
                }
            }
        });
    }
}
module.exports = EntryOptionPlugin;