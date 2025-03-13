# webpack-core-plugins


## Install

```
npm i @sunny-117/jspack
```

## usage

```js
import { jspack } from '@sunny-117/jspack'

import jspackOptions from './jspack.config.js'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err, stats.toJson())
})

```

## Contribute

```shell
pnpm i
pnpm run dev # tsup 编译 jspack
cd playground
pnpm build
```

## architecture

<img src="./workflow.webp" />
