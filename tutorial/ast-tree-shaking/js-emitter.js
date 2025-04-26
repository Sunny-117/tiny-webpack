/**
 * JSEmitter 类
 * 用于将 AST 节点转换为 JavaScript 代码
 */
class JSEmitter {
  constructor() {
    this.indent = 0;
  }

  /**
   * 运行转换过程
   * @param {Array} nodes - AST 节点数组
   * @returns {string} 生成的 JavaScript 代码
   */
  run(nodes) {
    return nodes.map(node => this.visitNode(node)).join('\n');
  }

  /**
   * 访问节点并根据节点类型调用相应的处理方法
   * @param {Object} node - AST 节点
   * @returns {string} 生成的代码片段
   */
  visitNode(node) {
    switch (node.type) {
      case 'FunctionDeclaration':
        return this.visitFunctionDeclaration(node);
      case 'VariableDeclaration':
        return this.visitVariableDeclaration(node);
      case 'ExpressionStatement':
        return this.visitExpressionStatement(node);
      case 'CallExpression':
        return this.visitCallExpression(node);
      case 'Identifier':
        return this.visitIdentifier(node);
      case 'Literal':
        return this.visitLiteral(node);
      case 'BinaryExpression':
        return this.visitBinaryExpression(node);
      case 'BlockStatement':
        return this.visitBlockStatement(node);
      case 'ReturnStatement':
        return this.visitReturnStatement(node);
      default:
        return `/* 未处理的节点类型: ${node.type} */`;
    }
  }

  /**
   * 访问函数声明
   * @param {Object} node - 函数声明节点
   * @returns {string} 函数声明代码
   */
  visitFunctionDeclaration(node) {
    const name = this.visitIdentifier(node.id);
    const params = node.params.map(param => this.visitNode(param)).join(', ');
    const body = this.visitBlockStatement(node.body);
    return `function ${name}(${params}) ${body}`;
  }

  /**
   * 访问变量声明
   * @param {Object} node - 变量声明节点
   * @param {string} kind - 变量声明类型 (var, let, const)
   * @returns {string} 变量声明代码
   */
  visitVariableDeclaration(node, kind = 'var') {
    if (node.type === 'VariableDeclaration') {
      // 处理完整的 VariableDeclaration 节点
      const declarations = node.declarations
        .map(decl => this.visitVariableDeclaration(decl, node.kind))
        .join(';\n');
      return declarations;
    } else {
      // 处理单个 VariableDeclarator
      const id = this.visitIdentifier(node.id);
      const init = node.init ? this.visitNode(node.init) : 'undefined';
      return `${kind} ${id} = ${init}`;
    }
  }

  /**
   * 访问表达式语句
   * @param {Object} node - 表达式语句节点
   * @returns {string} 表达式语句代码
   */
  visitExpressionStatement(node) {
    return `${this.visitNode(node.expression)};`;
  }

  /**
   * 访问函数调用表达式
   * @param {Object} node - 函数调用表达式节点
   * @returns {string} 函数调用代码
   */
  visitCallExpression(node) {
    const callee = this.visitNode(node.callee);
    const args = node.arguments.map(arg => this.visitNode(arg)).join(', ');
    return `${callee}(${args})`;
  }

  /**
   * 访问标识符
   * @param {Object} node - 标识符节点
   * @returns {string} 标识符名称
   */
  visitIdentifier(node) {
    return node.name;
  }

  /**
   * 访问字面量
   * @param {Object} node - 字面量节点
   * @returns {string} 字面量代码
   */
  visitLiteral(node) {
    if (typeof node.value === 'string') {
      return `"${node.value}"`;
    }
    return String(node.value);
  }

  /**
   * 访问二元表达式
   * @param {Object} node - 二元表达式节点
   * @returns {string} 二元表达式代码
   */
  visitBinaryExpression(node) {
    const left = this.visitNode(node.left);
    const right = this.visitNode(node.right);
    return `${left} ${node.operator} ${right}`;
  }

  /**
   * 访问代码块
   * @param {Object} node - 代码块节点
   * @returns {string} 代码块代码
   */
  visitBlockStatement(node) {
    this.indent += 2;
    const body = node.body.map(stmt => {
      return ' '.repeat(this.indent) + this.visitNode(stmt);
    }).join('\n');
    this.indent -= 2;
    return `{\n${body}\n${' '.repeat(this.indent)}}`;
  }

  /**
   * 访问返回语句
   * @param {Object} node - 返回语句节点
   * @returns {string} 返回语句代码
   */
  visitReturnStatement(node) {
    const argument = node.argument ? this.visitNode(node.argument) : '';
    return `return ${argument};`;
  }
}

module.exports = JSEmitter;
