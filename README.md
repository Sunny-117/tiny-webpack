# jspack

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

✨ A JavaScript bundler with Webpack-like features, supporting modern frontend workflows.

📦 Features
----------
- 🧩 **Loader & Plugin System**  
- 🕰️ **Lazy Loading & Dynamic Import**  
- 📦 **Third-party Module Resolution**  
- ✂️ **Code Splitting & SplitChunks**  
- 🌳 **Tree Shaking**  
- ⚡ **Preload/Prefetch Support**  
- 🏃 **Loader Runner**  
- 🧠 **Multi-page Application (MPA) Support**

🚀 Quick Start
-------------
### Installation
```bash
npm install @sunny-117/jspack --save-dev
# or
yarn add @sunny-117/jspack -D
```

### Basic Usage
```javascript
// jspack.config.js
import { resolve } from 'path'

export default {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
// test.js
import { jspack } from '@sunny-117/jspack'

import jspackOptions from './jspack.config.js'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err, stats.toJson())
})
```

⚙️ Configuration Guide
----------------------
### Core Options
| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `entry` | string/object | - | Entry point(s) |
| `output.path` | string | - | Output directory |
| `output.filename` | string | `[name].js` | Output filename pattern |
| `mode` | `development/production` | `development` | Build environment |

### Loader Configuration
```javascript
// handle less file
export default {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'less-loader'
        ]
      }
    ]
  }
}
```

### Multi-page Application
```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

export default {
  entry: {
    page1: './src/page1.js',
    page2: './src/page2.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      chunks: ['page1'],
      filename: 'page1.html'
    })
  ]
}
```

🔧 Advanced Features
-------------------
### Code Splitting
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 30000,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: 10
      }
    }
  }
}
```

### 懒加载示例
```javascript
// dymamic import
button.addEventListener('click', async () => {
  const module = await import('./lazy-module.js')
  module.doSomething()
})
```

📚 API Reference
---------------
### Loader Interface
```javascript
// 自定义loader示例
export default function (source) {
  return `
    import { createElement } from 'react'
    ${source}
  `
}
```

### Plugin Development
```javascript
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (assets) => {
      // handle assets here
    })
  }
}
```

📁 Project Structure
-------------------
```
project-root/
├── src/
│   ├── index.js       # entry
│   └── styles.less    # LESS
├── loaders/           # custom loader
├── jspack.config.js   # config
└── dist/              # output
```

🛠️ Development Guide
-------------------
### custom loader resolver
```javascript
export default {
  resolveLoader: {
    modules: ['custom_loaders', 'node_modules']
  }
}
```

### performance optimization
```javascript
// prefetch example
import(/* webpackPrefetch: true */ './critical-module.js')
```

## Contributing

```shell
pnpm i
pnpm run dev # tsup 编译 jspack
cd playground
pnpm build
```

## License

[MIT](./LICENSE) License © [Sunny-117](https://github.com/Sunny-117)


<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@sunny-117/jspack?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@sunny-117/jspack
[npm-downloads-src]: https://img.shields.io/npm/dm/@sunny-117/jspack?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@sunny-117/jspack
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@sunny-117/jspack?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@sunny-117/jspack
[license-src]: https://img.shields.io/github/license/Sunny-117/jspack.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/Sunny-117/async-processor/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@sunny-117/jspack
