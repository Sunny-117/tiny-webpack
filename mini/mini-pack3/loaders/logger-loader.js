module.exports = function (sourceCode, name, modulePath) {
  console.log("只要匹配到符合rule的文件，就会过一遍loader...", { name, modulePath });
  return sourceCode;
}
