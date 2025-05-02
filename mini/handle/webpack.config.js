const path = require('path');

module.exports = {
    context:process.cwd(),
    mode:'development',
    devtool:false,
    // entry:'./src/loader-test.js',
    // entry:{
    //   // 提取公共模块 lodash: 分离common和vender
    //   entry1: './src/entry1.js',
    //   entry2: './src/entry2.js',
    // },
    entry: {
        home: './src/chunk/home.js',
        login: './src/chunk/login.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        // path:path.resolve(__dirname,'dist-testSplitChunk'),
        filename:'[name].js',
    },
    module:{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','less-loader']
            }
        ]
    },
    optimization:{
        splitChunks:{
            chunks:'all',
            minSize:0,
            maxSize:0,
        },
        runtimeChunk: true
    },
    plugins:[
        
    ]
}
