const jszip = require('jszip');
const { RawSource } = require('webpack-sources');
const { Compilation } = require('webpack');
/**
 * 1.如何获取打出后的文件名和文件内容
 * 2.如何打压缩包 
 * 3.如何向目标目录输出压缩包
 */
class WebpackArchivePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('WebpackAssetsPlugin', (compilation) => {
      //当确定好文件，当你处理每个资源的时候处执行
      compilation.hooks.processAssets.tapPromise({ name: 'WebpackArchivePlugin' }, (assets) => {
        const zip = new jszip();
        for (const filename in assets) {
          const sourceObj = assets[filename];
          const sourceCode = sourceObj.source();
          zip.file(filename, sourceCode);
        }
        return zip.generateAsync({ type: 'nodebuffer' }).then(zipContent => {
          assets[`archive_${Date.now()}.zip`] = new RawSource(zipContent);
        });
      });
    });
  }
}
module.exports = WebpackArchivePlugin;
