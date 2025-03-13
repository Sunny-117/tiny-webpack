const {AsyncSeriesBailHook} = require('tapable')
// bail就是如果当前的钩子函数返回了值,那么就会直接跳过后面的所有钩子函数,直接结束
const factorize = new AsyncSeriesBailHook(['resolveData'])

class Module {}

class NormalModule extends Module {
  constructor(name) {
    super()
    this.name = name
  }
}
class ExternalModule extends Module {
  constructor(name) {
    super()
    this.name = name
  }
}
factorize.tapAsync('tap1', (resolveData, callback) => {
  if (resolveData === 'jquery') {
    // 覆盖默认行为
    callback(null, new ExternalModule('jQuery'))
  }else{
    callback(null)
  }
})

// 默认逻辑
factorize.tapAsync('tap2', (resolveData, callback) => {
  callback(null, new NormalModule('jquery'))
  // 对应webpack源码中：createdModule = new NormalModule();
})

// 对比下面两种
// 1. 
factorize.callAsync('jquery', (err, res) => {
  console.log(res)
})
// 2.
// factorize.callAsync('11jquery', (err, res) => {
//   console.log(res)
// })