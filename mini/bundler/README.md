# 手写 bundler

## 实现一个自己的简易打包器，我们的目标将会向 Webpack 打包设计对齐

1. 读取入口文件（比如entry.js）；
2. 基于 AST 分析入口文件，并产出依赖列表；
3. 使用 Babel 将相关模块编译到 ES5；
4. 对每个依赖模块产出一个唯一的 ID，方便后续读取模块相关内容；
5. 将每个依赖以及经过 Babel 编译过后的内容，存储在一个对象中进行维护；
6. 遍历上一步中的对象，构建出一个依赖图（Dependency Graph）；
7. 将各模块内容 bundle 产出。

## 步骤

依赖解析（Dependency Resolution）和代码打包（Bundling）：
- 在依赖解析过程中，通过 AST，找到每个模块的依赖模块，并组合为最终的项目依赖树。
- 在代码打包过程中，使用 Babel 对源代码进行编译，其中也包括了对 imports / exports（即对 ESM） 的编译。

## 依赖
- @babel/parser用于分析源代码，产出 AST；
- @babel/traverse用于遍历 AST，找到 import 声明；
- @babel/core用于编译，将源代码编译为 ES5；
- @babel/preset-env搭配@babel/core使用；
- resolve用于获取依赖的绝对路径。


