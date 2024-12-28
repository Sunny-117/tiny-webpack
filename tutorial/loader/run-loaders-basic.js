const path = require('path')
const fs = require('fs')
const { runLoaders } = require('loader-runner')

const resource = path.resolve(__dirname,'src','index.js')
const loaders = [
  path.resolve(__dirname,'loaders','post-loader1.js'),
  path.resolve(__dirname,'loaders','post-loader2.js'),
  path.resolve(__dirname,'loaders','inline-loader1.js'),
  path.resolve(__dirname,'loaders','inline-loader2.js'),
  path.resolve(__dirname,'loaders','normal-loader1.js'),
  path.resolve(__dirname,'loaders','normal-loader2.js'),
  path.resolve(__dirname,'loaders','pre-loader1.js'),
  path.resolve(__dirname,'loaders','pre-loader2.js'),
]
runLoaders({
    resource,
    loaders,
    context: {name:'Sunny'}, // 基础的上下文对象
	readResource: fs.readFile.bind(fs)
}, function(err, result) {
    console.log(err);
    console.log(result);
})
