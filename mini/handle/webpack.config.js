const path = require('path');

module.exports = {
    context:process.cwd(),
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    // entry:{
    //   // 提取公共模块 lodash: 分离common和vender
    //   entry1: './src/entry1.js',
    //   entry2: './src/entry2.js',
    // },
    output:{
        path:path.resolve(__dirname,'dist'),
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
    plugins:[
        
    ]
}
