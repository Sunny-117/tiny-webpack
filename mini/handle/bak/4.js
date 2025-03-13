let path = require('path');
console.log(path.sep);//返回当前操作系统下的路径分隔符 win \ mac / linux /
console.log(path.posix.sep);//返回linux中的路径分隔符,永远都是/
console.log(path.win32.sep);//返回windows中的路径分隔符,永远都是\