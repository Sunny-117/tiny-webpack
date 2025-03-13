# webpack-core-plugins

# Dev

```shell
pnpm i
pnpm run dev # tsup 编译 jspack
cd playground
node index.js
```

# 功能

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


# architecture

<img src="./workflow.webp" />
