let stats = {
  errors: [],//报错信息
  warnings: [],//警告信息
  version: '4.43.0',//webpack版本号
  hash: '6e234b5c1fe547375905',//本次编译的哈希值 hash
  time: 115,//编译花的时间
  builtAt: 1594814892846,//编译时候时间戳
  publicPath: '',///公开访问路径 打包后再被引入的页面的时候会以什么开头
  outputPath: 'C:\\anormal\\sunny\\5.hand\\dist',//输出目录
  assetsByChunkName: { main: 'main.js' },//key chunk的名称 value是对应的文件名
  assets: [//产出了哪些文件
    {
      name: 'main.js',
      size: 4126,
      chunks: [Array],
      chunkNames: [Array],
      emitted: true,//是否写入硬盘了
    }
  ],
  entrypoints: {//入口点
    main: {
      chunks: [Array],//main
      assets: [Array] //main.js
    }
  },
  //在webpack4里,多了个概念 chunkGroup,是用来进行代码的分割或合并的
  //spitChunks会用到
  namedChunkGroups: {
    main: {//chunkGroup main
      chunks: [Array],//main
      assets: [Array]// main.js
    }
  },
  chunks: [
    {
      id: 'main',//chunkid
      rendered: true,//是否已经生成渲染
      initial: true,//是否初始化模块 import 懒加载
      entry: true,//是否是入口代码块
      size: 77,
      names: [Array],
      files: [Array],
      hash: 'e15b5777689ecf095c15',//chunkHash 生个代码块有自己的hash值 
      siblings: [],//兄弟代码块
      parents: [],//父代码块
      children: [],//子代码块
      modules: [Array]//这个代码块包含哪些模块 
    }
  ],
  modules: [
    {
      id: './src/index.js',//模块ID
      identifier: 'C:\\anormal\\sunny\\5.hand\\src\\index.js',//此模块打包前的绝对路径 
      name: './src/index.js',
      index: 0,//是从0开始的
      index2: 1,//从1开始
      size: 52,
      cacheable: true,//是否缓存
      built: true,
      optional: false,
      prefetched: false,//是否要预获取 prefetched preloaded 
      chunks: [Array],//module chunk是多对多的关系 ,一个模块可能会被包含在多个代码块中,一个代码块可能包含多个模块
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array],//由于什么原因此模块被打包进来了
      providedExports: null,
      optimizationBailout: [],
      depth: 0,//相于辈分  入口模块辈分0 儿子 1  孙子2
      source: "let title = require('./title');\r\nconsole.log(title);"
    },
    {
      id: './src/title.js',
      identifier: 'C:\\anormal\\sunny\\5.hand\\src\\title.js',
      name: './src/title.js',
      index: 1,
      index2: 0,
      size: 25,
      cacheable: true,
      built: true,
      chunks: [Array],
      issuer: 'C:\\anormal\\sunny\\5.hand\\src\\index.js',//哪个模块依赖我这个模块,导致我被打包进来了,这里放的是主模块绝对路径 
      issuerId: './src/index.js',
      issuerName: './src/index.js',
      issuerPath: [Array],
      failed: false,
      errors: 0,
      warnings: 0,
      assets: [],
      reasons: [Array],//index.js
      providedExports: null,
      optimizationBailout: [],
      depth: 1,
      source: 'module.exports = "title";'
    }
  ]
}
//hash的生成是有规则的,这个我们后面实现这个规模 md5算法