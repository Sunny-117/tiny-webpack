let module1 = require('./module1');
let module2 = require('./module2');
let $ = require('jquery');
console.log(module1,module2,$);
import( /* webpackChunkName: "asyncModule1111" */ './asyncModule1');

// page1,page2,page3都用到了module1，所以module1被抽去到common


// 调低网速，看请求过程
import('./lazy/1')
import('./lazy/2')
import('./lazy/3')
import('./lazy/4')
import('./lazy/5')