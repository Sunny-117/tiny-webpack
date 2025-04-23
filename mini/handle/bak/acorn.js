const acorn = require("acorn")
const walk = require("acorn-walk");
const escodegen = require('escodegen');
const ast = acorn.parse(`
import $ from 'jquery';
let _ = require('lodash');
`, { locations: true, ranges: true, sourceType: 'module', ecmaVersion: 8 });
let resources = [];
walk.simple(ast, {
  CallExpression(node) {
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'require' &&
      node.arguments.length === 1 &&
      node.arguments[0].type === 'Literal'
    ) {
      const args = node.arguments;
      resources.push({
        module: args[0].value
      })
    }
  },
  ImportDeclaration(node) {
    node.specifiers[0].local.name = 'jQuery';
    resources.push({
      module: node.source.value
    })
  }
})
console.log('resources', resources);
let result = escodegen.generate(ast);
console.log(result);


// ● ecmaVersion 你要解析的 JavaScript 的 ECMA 版本,默认是 ES7
// ● sourceType 这个配置项有两个值：module 和 script，默认是 script.主要是严格模式和 import/export 的区别.
// ● locations 默认值是 false，设置为 true 之后会在 AST 的节点中携带多一个 loc 对象来表示当前的开始和结束的行数和列数。
// ● onComment 传入一个回调函数，每当解析到代码中的注释时会触发，可以获取当年注释内容，参数列表是：[block, text, start, end],block 表示是否是块注释，text 是注释内容，start 和 end 是注释开始和结束的位置
