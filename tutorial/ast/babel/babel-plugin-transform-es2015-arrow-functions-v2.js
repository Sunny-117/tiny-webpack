const babel = require('@babel/core')
const t = require('babel-types')
const { default: consola } = require('consola')


const arrowFnPlugin = {
  visitor: {
    ArrowFunctionExpression: (path) => {
      const node = path.node; // 当前路径上的节点
      const id = path.parent.id; // 父路径的id
      const params = node.params;
      const body = node.body;
      const functionExpression = t.functionExpression(id, params, body, node.generator, node.async)
      const thisVariableDeclarator = t.variableDeclaration('var', [
        // var _this = this;
        t.variableDeclarator(t.identifier('_this'), t.thisExpression())
      ])
      const newNodes = [thisVariableDeclarator, functionExpression]
      path.replaceWithMultiple(newNodes)
    },
    // console.log(this); -> console.log(_this);
    ThisExpression(path) {
      if (path.parent.type === 'CallExpression' || path.parent.type === 'ExpressionStatement') { // console.log()
        path.replaceWith(t.identifier('_this'))
      }
    }
  }
}

const code = `
  const sum = (a, b) => {
    console.log(this);
    this
    return a+b;  
  };
`
const result = babel.transform(code, {
  plugins: [arrowFnPlugin]
})
consola.success('转换后的代码', result.code)
