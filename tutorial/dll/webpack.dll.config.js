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
