let loaderUtils = require('loader-utils');
function loader(sourceCode) {
  return `module.exports = ${JSON.stringify(sourceCode)}`
}

loader.pitch = function(remainingRequest,previousRequest,data){
  return `
      let result = require(${loaderUtils.stringifyRequest(this,"!!"+remainingRequest)});
      if(result && result.__esModule){
          result = result.default;
      }
      if(typeof result === 'string'){
          module.exports = result;
      }else{
          module.exports = result.toString();
      }
  `;
}
module.exports = loader;
