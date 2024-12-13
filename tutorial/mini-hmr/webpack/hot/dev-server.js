var hotEmitter = require('../../webpack/hot/emitter');
hotEmitter.on('webpackHotUpdate', (currentHash) => {
  console.log('dev-server收到了最新的hash值', currentHash);
  //进行真正的热更新检查
  // hotCheck();
});


// 这里webpack监听到了webpackHotUpdate事件，并获取最新了最新的hash值，然后终于进行检查更新了。

// 检查更新呢调用的是module.hot.check方法。

// 那么问题又来了，module.hot.check又是哪里冒出来了的！答案是HotModuleReplacementPlugin搞得鬼。
