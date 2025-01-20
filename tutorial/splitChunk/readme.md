# 分包

1. entry分割
- 如果入口chunk包含重复模块，这些模块会被重复打包
- 不够灵活，只能入口为单位，不能做按需加载 动态拆分

```js
// src/page1.js
import lodash from 'lodash';
// src/page2.js
import lodash from 'lodash';
// 会打包两份lodash
```

2. 按需加载 import()

# 提取公共代码

```js
// src/page1.js
import lodash from 'lodash';
// src/page2.js
import lodash from 'lodash';
// 会打包两份lodash
```

- 期望抽离第三方模块 lodash: venders
- 公共模块抽离: commons

# page1 产物分析

```js
// add entry module to deferred list
// 1元素是入口模块, 后面是依赖的代码块的名字
deferredModules.push(["./src/page1.js","vendors~page1~page2","default~page1~page2"]);

function checkDeferredModules() {
    var result;
    for(var i = 0; i < deferredModules.length; i++) {
        var deferredModule = deferredModules[i];
        var fulfilled = true;
        // 从索引1开始循环【从代码块开始循环】
        for(var j = 1; j < deferredModule.length; j++) {
            var depId = deferredModule[j];
            if(installedChunks[depId] !== 0) fulfilled = false; // 有一个没有加载完成就是false，不能运行入口代码块./src/page1
        }
        if (fulfilled) {
            // 前置依赖已经加载过了，就可以运行入口代码块./src/page1了
            deferredModules.splice(i--, 1);
            result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
        }
    }
    return result;
}

```

调试下产物

```html
<body>
    <!-- <script src="runtime~page1.js"></script>
    <script src="defaultVendors~page1~page2~page3.js"></script>
    <script src="commons~page1~page2~page3.js"></script>
    <script src="commons~page1~page2.js"></script> -->

    <script src="page1.js"></script>
    <script>
        setTimeout(() => {
            const script = document.createElement('script')
            script.src = 'runtime~page1.js'
            document.body.appendChild(script)
        }, 1000)
        setTimeout(() => {
            const script = document.createElement('script')
            script.src = 'defaultVendors~page1~page2~page3.js'
            document.body.appendChild(script)
        }, 2000)
        setTimeout(() => {
            const script = document.createElement('script')
            script.src = 'commons~page1~page2~page3.js'
            document.body.appendChild(script)
        }, 3000)
        setTimeout(() => {
            const script = document.createElement('script')
            script.src = 'commons~page1~page2.js'
            document.body.appendChild(script)
        }, 4000)
    </script>
</body>

```

# 计算过程

```js
//入口代码块
page1.js
page2.js
page3.js
//异步加载代码块
src_asyncModule1_js.js
//defaultVendors缓存组对应的代码块
defaultVendors-node_modules_jquery_dist_jquery_js.js
defaultVendors-node_modules_lodash_lodash_js.js
//default代缓存组对应的代码块
default-src_module1_js.js
default-src_module2_js.js
```

计算过程

```js
let page1Chunk= {
    name:'page1',
    modules:['A','B','C','lodash']
}

let page2Chunk = {
    name:'page2',
    module:['C','D','E','lodash']
}

let  cacheGroups= {
    vendor: {
      test: /lodash/,
    },
    default: {
      minChunks: 2,
    }
};

let vendorChunk = {
    name:`vendor~node_modules_lodash_js`,
    modules:['lodash']
}
let defaultChunk = {
    name:`default~page1~page2`,
    modules:['C']
}
```


# todo
```js
//配置如何优化
    optimization:{
        //设置代码块的分割方案
        splitChunks:{
            chunks:'all',//同时分割同步和异步,默认只分割异步
            minSize:0, //被提供的代码的大小,默认是30K
            //要分割哪些代码块  initial=是同步 require import xx/async import('yy') all=initial+async 
            //page1~page2
            automaticNameDelimiter:"~",
            maxAsyncRequests: 3,//同一个入口分割出来的最大异步请求数
            maxInitialRequests: 5,//同一个入口分割出来的最大同步请求数
            name:true,//设置代码块打包后的名称,默认名称是用分隔符~分隔开的原始代码块
            //缓存组 设置不同的缓存组来抽取满足不同规则的chunk.
            //webpack里面还有一些默认缓存组,它的优先级是0
            cacheGroups:{
                 //第三方 提供者
                vendors:{//把符合条件的缓存组提取出来放在vendor这个代码块里
                    test: /[\\/]node_modules[\\/]/,//模块路径里有node_modules的话
                    priority: -10,
                    name:'vendors'
                },
                //提供不同的代码块之间的公共代码
                //commons~page1~page2.js
                default:{
                  minChunks:2,//如果这个模块被2个或2个以上的代码块引用了,就可以单独提取出来
                  priority:-20,
                  name:'commons'
                }
            }
        },
        ///runtimeChunk:false
    },
```
