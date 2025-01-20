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
