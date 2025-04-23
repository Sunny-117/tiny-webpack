// const title = require('./title.js')
// console.log(title)

require('./sync')
// 如果遇到了import,那么import的模块会成为一个单独的入口,会生成一个单独的代码块,会生成一个单独的文件
//如果import调用了一个模 块,那么这个模块和它依赖的模块会成一个单独的的异步代码块,里面所有的模块async=true
import(/* jspackChunkName: "title" */ './title').then((result) => {
  console.log(result)
})

import(/* jspackChunkName: "sum" */ './sum').then((result) => {
  console.log(result)
})

const isArray = require('isarray')

isArray([1, 2, 3])
