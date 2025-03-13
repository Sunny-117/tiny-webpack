# doc

## 功能

✅ Compiler run

✅ Compiler make

✅ buildModule

✅ Stats

✅ Seal封装Chunk代码块

✅ emit

✅ 懒加载

✅ 加载第三方模块

```js
this.vendors = []; //把第三方的模块放在这里
this.commons= []; //把是第三方的,不同的页面共享的次数大于等2的模块放在这里
this.commonsCountMap={};//用来计算模块被引用的次数
```

✅ SplitChunks

✅ 代码分割 dynamic import

```js
this.blocks = []; // 异步代码块的依赖
```

✅ runtime

✅ loader-runner

✅ hash

✅ treeshake

✅ preload和prefetch

✅ loader

✅ plugin


# 注意
- Compiler对象包含了Webpack环境所有的的配置信息,包含 options,loaders,plugins这些信息,这个对
象在Webpack启动时候被实例化,它是全局唯一的
- Compilation对象包含了当前的模块资源、编译生成资源、变化的文件等。当Webpack以开发模式运行时,每
当检测到一个文件变化,一次新的Compilation将被创建
- Compiler和Compilation的区别在于:Compiler代表了整个Webpack从启动到关闭的生命周期,而
Compilation只是代表了一次新的编译

# 流程

创建模块之前先走loaders(把文件转换成js能处理的文件)->ast语法解析->收集依赖模块->创建模块

## architecture

<img src="./workflow.webp" />
