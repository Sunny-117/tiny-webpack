(function() {
  const modules = {
    // css-loader处理后的代码
    'css-loader.js!./src/global.css': (module, exports, require) => {
      const api = require('api.js')
      const cssWithMappingToString = item=>item[1]
      const EXPORT = api(cssWithMappingToString);
      EXPORT.push([
        module.id,
        "body{\r\n background-color: green; \r\n}"
      ])
      module.exports = EXPORT;
    },
    "api.js": (module, exports, require) => {
      module.exports = function(cssWithMappingToString) {
        const list = [];
        list.toString = function() {
          return this.map(cssWithMappingToString).join('')
        }
        return list;
      }
    },
    './src/global.css': (module, exports, require) => {
      const result = require("css-loader.js!./src/global.css");
      module.exports = result.toString();
    },
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
