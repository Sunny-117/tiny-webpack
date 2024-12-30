const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const code = `
  function ast() { }
`
const ast = esprima.parse(code)
let indent = 0;
function padding() {
  return " ".repeat(indent)
}
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'newAst'
    }
    indent += 2;
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + "离开");
  }
})

const newCode = escodegen.generate(ast)
console.log(newCode)
