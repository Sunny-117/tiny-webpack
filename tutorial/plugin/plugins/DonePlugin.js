
class DonePlugin{
  apply(compiler){
    compiler.hooks.done.tapAsync('DonePlugin',(stats,callback)=>{
        console.log('DonePlugin');
        callback();
    });
  }
}
module.exports = DonePlugin;
