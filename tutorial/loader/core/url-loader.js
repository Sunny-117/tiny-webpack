const mime = require('mime');

function loader(source) {
  // this: loaderContext
  const options = this.loaderContext || {
    name: '[hash:8].[ext]',
    limit: 8*1024
  };
  const {limit = 8*1024, fallback = "file-loader"} = options;
  const mimeType = mime.getType(this.resourcePath)
  if(content.length<limit) {
    const base64Str = `data:${mimeType};base64,${source.toString('base64')}`
    return `module.export=${JSON.stringify(base64Str)}`
  }
  const fileLoader = require(fallback)
  return fileLoader.call(this, content)  
}
// 如果不希望webpack把内容转成字符串，loader.raw=true,这样content就是二进制的buffer
loader.raw = true;
module.exports = loader;
