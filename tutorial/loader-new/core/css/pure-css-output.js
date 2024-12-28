(function() {
  const modules = {
    './src/global.css': (module, exports, require) => {
      module.exports = "body{\r\n background-color: green; \r\n}"
    }
  }
  const cache = {};
  function require(moduleId) {
    if(cache[moduleId]){
      return cache[moduleId].exports;
    }
    const module = (cache[moduleId] = {
      id: moduleId,
      exports: {}
    })
    modules[moduleId](module, module.exports, require)
    return module.exports;
  }
  const css = require("./src/global.css");
  console.log(css)
})()

// run node core/css/pure-css-output.js
/**
output:

body{
 background-color: green; 
}

 */
