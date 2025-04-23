const Compiler = require('./Compiler');

function webpack(options) {
  // 1. 初始化文件，从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
  // console.log(process.argv); // 获取命令参数，参数与webpack.config.js同名的时候，参数会覆盖配置文件，也就是说参数的优先级更高
  let shellOptions = process.argv.slice(2).reduce((shellConfig, item) => {
    let [key, value] = item.split('=')
    shellConfig[key.slice(2)] = value;
    return shellConfig;
  }, {})
  let finalConfig = { ...options, ...shellOptions };
  // console.log(finalConfig)
  // 2. 用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(finalConfig);
  // 3. 加载所有配置的插件
  let { plugins } = finalConfig;
  for (let plugin of plugins) {
    plugin.apply(compiler);
    // 注册所有插件的事件，是通过tapable的tap来注册的，然后就是等待着合适的时机去触发事件，也就是调用tapable的call函数
    // 由于触发的时机是固定的，所以不同时机触发的插件，在注册的时候谁先谁后都无所谓，那么webpack的plugins中写的谁先谁后其实都无所谓。但是如果多个插件是统一时机触发的，那么就是谁先注册谁就先触发。
  }
  // 4. 执行compiler对象的run方法开始编译，调用run在外面，具体的run方法在Compiler类中

  // 最后，需要将compiler对象返回
  return compiler;
}
module.exports = webpack;
