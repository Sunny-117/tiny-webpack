const core = require('@babel/core');
const path = require('path');

/**
 * @param {*} source 上一个loader给的内容/最原始的模块内容
 * @param {*} inputSourceMap 上一个loader传递过来的sourceMap
 * @param {*} data 本loader额外的数据
 */
function loader(source, inputSourceMap, data) {
  console.log(this.request, 'this.request')
  const {code, map, ast} = core.transform(source, {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMaps: true, // 告诉babel要生成sourceMap
    filename: path.basename(this.resourcePath)
  })
  /**
   * 当需要返回多个值：this.callback
   * 只需要返回一个值：return
   * 异步的时候只能用callback
   */
  return this.callback(null, code, map, ast) // 此处如果返回了ast给到了webpack，则webpack可以直接使用ast
}

loader.pitch = function (remainingRequest, previousRequest, data) {
  // 每个loader都有自己的data
  data.name = 'babel-loader-pitch'
}
module.exports = loader;
