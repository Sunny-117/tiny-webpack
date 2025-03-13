import { jspack } from 'tiny-webpack'

// import jspackOptions from './jspack.config.js'

// import jspackOptions from './jspack.loader.js'
import jspackOptions from './jspack.splitChunks.js'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err, stats.toJson())
})
