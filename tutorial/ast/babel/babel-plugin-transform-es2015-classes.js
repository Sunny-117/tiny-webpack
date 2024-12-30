const babel = require('@babel/core')
const t = require('babel-types')
const { default: consola } = require('consola')

const classesPlugin = {
  visitor: {
    ClassDeclaration: (path) => {
      const node = path.node; // 类的节点
      const id = node.id; // 类的名字 Person
      // 两类：构造函数；普通函数
      const methods = node.body.body;
      let constructorFunction;
      const newNodes = []
      methods.forEach(method => {
        if (method.kind === 'constructor') {
          constructorFunction = t.functionDeclaration(
            id,
            method.params,
            method.body,
            method.generator,
            method.async
          )
          newNodes.push(constructorFunction)
        }
        else if (method.kind === 'method') {
          // 左边
          const memberExpression = t.memberExpression(
            t.memberExpression(id, t.identifier('prototype')),
            method.key
          )
          // 右边
          const functionExpression = t.functionExpression(
            method.key,
            method.params,
            method.body,
            method.generator,
            method.async
          )
          const assignmentExpression = t.assignmentExpression(
            '=',
            memberExpression,
            functionExpression
          );
          const expressionStatement = t.expressionStatement(assignmentExpression)
          newNodes.push(expressionStatement)
        }
      })
      path.replaceWithMultiple(newNodes)
    }
  }
};

const code = `
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name
  }
}  
`
const result = babel.transform(code, {
  plugins: [classesPlugin]
})
consola.success('转换后的代码', result.code)

const res = `
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name
}
  `
