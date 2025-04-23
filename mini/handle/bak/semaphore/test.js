// Semaphore(信号量)控制并发访问量
// https://github.com/webpack/webpack/blob/v4.39.3/lib/Compilation.js#L857-L971


let Semaphore = require('semaphore');
let semaphore = new Semaphore(2);
console.time('cost');
semaphore.take(function () {
  setTimeout(() => {
    console.log(1);
    semaphore.leave();
  }, 1000);
});
semaphore.take(function () {
  setTimeout(() => {
    console.log(1);
    semaphore.leave();
  }, 2000);
});
semaphore.take(function () {
  console.log(3);
  semaphore.leave();
  console.timeEnd('cost');
});
