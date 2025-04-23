const { forEach } = require('neo-async');
// neo-async库和async库类似，都是为异步编程提供一些工具方法，但是会比async库更快

let arr = [1, 2, 3];
console.time('cost');//Promise.all
forEach(arr, function (item, callback) {
  setTimeout(function () {
    callback();
  }, 1000 * item);
}, function () {
  console.timeEnd('cost');
});

// 源码
// function forEach(arr, callback, finalCallback) {
//   let count = arr.length;
//   function done() {
//     if (--count == 0)
//       finalCallback();
//   }
//   arr.forEach(function (item) {
//     callback(item, done);
//   })
// }
/// path.dirname join relative


// https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js#L836
