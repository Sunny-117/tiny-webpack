const webpack = require('./webpack');
const options = require('./webpack.config');
const compiler = webpack(options);
const {writeFileSync} = require('fs');

compiler.run((err,stats)=>{
    console.log(err);
    let json = stats.toJson({
        entries:true,//显示入口
        chunks:true,//显示打包出来的代码块
        modules:true,//以数组方式模块
        _modules:true,//以对象的方式放置模块
        assets:true//产出的文件或者资源
    });
    console.log(json);
    writeFileSync('./dist/index.html', `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button class="btn">点击</button>
    <script src="./main.js"></script>
</body>
</html>
        `, 'utf8');
});
