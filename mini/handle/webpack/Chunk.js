
class Chunk{
    constructor(entryModule){
        this.entryModule = entryModule;
        this.name = entryModule.name;//代码块的名字 main
        this.files = [];//本代码生成的文件列表数组 一般来说一个代码块Chunk会生成一个文件
        this.modules = [];//本代码块包含的模块
        this.async = entryModule.async;//给chunk加一个标志 是同步还是异步
        //如果是直接引入的 同步,如果是通过 import方法调用引入的,就是异步,异步模块要单独分割出一个代码块
    }
}
module.exports = Chunk;