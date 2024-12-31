const path = require('path');

module.exports = {
    context:process.cwd(),
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
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
