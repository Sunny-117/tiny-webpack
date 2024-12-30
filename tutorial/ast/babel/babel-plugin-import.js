const babel = require('@babel/core')
const t = require('babel-types');
const { default: consola } = require('consola');


const visitor = {
  ImportDeclaration: {
    enter(path, state = {}) {
      const specifiers = path.node.specifiers;
      const source = path.node.source;
      // 导入的不是以默认导入的才会进入
      if (state.opts.sunnylibrary === source.value && !t.isImportDefaultSpecifier(specifiers[0])) {
        const declarations = specifiers.map(specifier => {
          return t.importDeclaration([t.importDefaultSpecifier(specifier.local)], t.stringLiteral(`${source.value}/${specifier.imported.name}`))
        })
        path.replaceWithMultiple(declarations)
      }
    }
  }
}

const code = `
import { flatten, concat } from 'lodash'
`

const result = babel.transform(code, {
  plugins: [[{ visitor }, { sunnylibrary: 'lodash' }]]
})
consola.success('转换后的代码', result.code)

module.exports = function () {
  return {
    visitor
  }
}
