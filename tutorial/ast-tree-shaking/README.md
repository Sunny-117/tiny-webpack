# 一个简易Tree Shaking脚本

## 介绍

- 测试脚本test.js
- acorn作为AST解析库
- 设计JSEmmitter类，用于根据AST产出Javascript代码
- 通过命令行进行处理.js文件，输出一个新的处理过的文件.min.js

## 使用方法

```bash
node treeShaking test.js
```
