(function() {
  const modules = {
    './src/global.css': (module, exports, require) => {
      const list = [];
      list.push([
        module.id,
        "body{\r\n background-color: green; \r\n}"
      ])
      const cssWithMappingToString = item=>item[1]
      const css = list.map(cssWithMappingToString).join('')
      module.exports = css;
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
