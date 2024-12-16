const path = require("path");
// const DllPlugin = require("webpack/lib/DllPlugin");
const DllPlugin2 = require("./plugins/DllPlugin");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    utils:["isarray","is-promise"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "utils.dll.js", //react.dll.js
    library: "_dll_utils",
  },
  plugins: [
    new DllPlugin2({
      //暴露出去的dll函数
      name: "_dll_utils",
      //输出的manifest json文件的绝对路径
      path: path.join(__dirname, "dist", "utils.manifest.json")
    }),
  ],
};


// const path=require('path');
// const DllPlugin=require('webpack/lib/DllPlugin');
// module.exports={
//     entry: {
//         react:['react','react-dom']
//     },// 把 React 相关模块的放到一个单独的动态链接库
//     output: {
//         path: path.resolve(__dirname,'dist'),// 输出的文件都放到 dist 目录下
//         filename: '[name].dll.js',//输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
//         library: '_dll_[name]',//存放动态链接库的全局变量名称,例如对应 react 来说就是 _dll_react
//     },
//     plugins: [
//         new DllPlugin({
//             // 动态链接库的全局变量名称，需要和 output.library 中保持一致
//             // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
//             // 例如 react.manifest.json 中就有 "name": "_dll_react"
//             name: '_dll_[name]',
//             // 描述动态链接库的 manifest.json 文件输出时的文件名称
//             path: path.join(__dirname, 'dist', '[name].manifest.json')
//         })
//     ]
// }
