// esm1
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
console.log(require.resolve('lodash'));

// esm2
console.log(await import.meta.resolve('lodash'));

// cjs
console.log(require.resolve('lodash')) // 会得到真实的依赖路径