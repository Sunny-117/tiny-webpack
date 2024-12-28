const path = require('path');
const {interpolateName} = require('loader-utils');

/**
 * 此文件内容拷贝到目标目录中
 * @param {*} content 
 * @param {*} inputSourceMap 
 * @param {*} data 
 */
function loader(content, inputSourceMap, data) {
  // this: loaderContext
  const options = this.loaderContext || {
    name: '[hash:8].[ext]',
    esModule: false
  };
  const filename = interpolateName(this, options.name, {content})
  this.emitFile(filename, content) // this.assets[filename] = content
  if (typeof options.esModule === 'undefined' ||options.esModule) {
    return `export default "${filename}"`
  }
  return `module.exports = "${filename}"`
}
module.exports = loader;
