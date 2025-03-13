let ejs = require('ejs');
let fs = require('fs');
let path = require('path');
let mainTemplate = fs.readFileSync(path.join(__dirname,'main.ejs'),'utf8');
let mainRender = ejs.compile(mainTemplate);
let modules = [
    {
        moduleId:"./src/index.js",
        source:`let title = __webpack_require__("./src/title.js");console.log(title);`
    },
    {
        moduleId:"./src/title.js",
        source:` module.exports = "title";`
    }
]
let source = mainRender({
    entryId:'./src/index.js',
    modules
});
console.log(source);