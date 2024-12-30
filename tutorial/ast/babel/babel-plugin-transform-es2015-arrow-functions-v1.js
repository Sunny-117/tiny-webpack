const babel = require('@babel/core')
const t = require('babel-types')
const { default: consola } = require('consola')


const arrowFnPlugin = {
  visitor: {
    ArrowFunctionExpression: (path) => {
      const node = path.node; // 当前路径上的节点
      const id = path.parent.id; // 父路径的id
      const params = node.params;
      const body = t.blockStatement([
        t.returnStatement(node.body)
      ]);
      const functionExpression = t.functionExpression(id, params, body, node.generator, node.async)
      path.replaceWith(functionExpression)
    }
  }
}

const code = `
  const sum = (a, b)=>a+b;
`

const result = babel.transform(code, {
  plugins: [arrowFnPlugin]
})
consola.success('转换后的代码', result.code)
