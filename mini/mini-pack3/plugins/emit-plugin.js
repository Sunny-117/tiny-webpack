class EmitPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('emit', (assets) => {
      assets['assets.md'] = Object.keys(assets).join('\n');
      console.log('这是发射文件之前触发')
    })
  }
}

module.exports = EmitPlugin;
