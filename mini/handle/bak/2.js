const path = require('path');

console.log(path.posix.relative('/usr/src/local/root','/usr/src/local/root/a/b/c'));
console.log('/usr/src/local/root/a/b/c'.slice('/usr/src/local/root'.length+1));




let str = "webpackChunkName: 'title'";
let regexp = /webpackChunkName:\s*['"]([^'"]+)['"]/;
console.log(str.match(regexp)[1]);
