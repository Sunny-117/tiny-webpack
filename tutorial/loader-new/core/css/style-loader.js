/**
 * pitch function
 * 先获取到style样式，然后创建一个style标签，并插入到页面中
 * 什么时候会用到pitch loader: 当你想把两个最左侧的loader级联使用的时候
 */
let loaderUtils = require('loader-utils');

function normal1(inputSource){
    return `
          let style = document.createElement('style');
          style.innerHTML = ${JSON.stringify(inputSource)};
          document.head.appendChild(style);
      `;  
}
normal.pitch = function(remainingRequest,previousRequest,data){
    //剩下的loader!要加载的路径
    // !!只要行内样式
    // !!./loaders/css-loader.js!./src/index.css
    console.log('start style-loader pitch log...')
    console.log(loaderUtils.stringifyRequest(this,"!!"+remainingRequest)),
    loaderUtils.stringifyRequest(this,"!!"+remainingRequest);
    console.log('start style-loader pitch end log...')
    let style =  `
     let style = document.createElement('style');
     style.innerHTML = require(${loaderUtils.stringifyRequest(this,"!!"+remainingRequest)}).toString();
     document.head.appendChild(style);
    `;  
    return style; // 跳过剩下的loader不继续走了
}

module.exports = normal;

// style-loader执行流程：style-loader pitch是第一个走的,走了,就拦截住了,转成行内loader在处理,然后直接返回给webpack了
// 第一轮：走到style-loader的pitch直接返回
// 第二轮：webpack解析道require依赖的时候，即资源：!!./loaders/css-loader.js!./src/index.css，会走 css-loader的pitch->读文件index.css->css-loader的normal->得到css-loader的产物，内容如下：
/**

let script = `
    var list = [];
    list.toString = function(){return this.join('')}
    ${importCss}
    list.push(\`${result.css}\`);
    module.exports = list;
`;

 */


/**
为什么不把style-loader写在normal里面？
style-loader的normal是最后一个loader，且拿到的是字符串，只能用eval执行，不好处理
只能这样写：
function normal(inputSource){
    console.log('inputSource',inputSource);
    let module = {exports:{}};
    let result = eval(inputSource);
    return `
            let style = document.createElement('style');
            style.innerHTML = ${JSON.stringify(module.exports)};
            document.head.appendChild(style);
      `;  
}
如果css-loader返回的是css，不是js，也可以放在normal中
 */



// loader分两种：
// 1. 最左侧的一定返回js，可以用require加载得到导出对象
// 2. 非最左侧的可以是任何内容，只要下一个loader可以处理就行
// 如果想连用两个最左侧的loader，需要写pitch，例如上面的style-loader
