const fs = require("fs");
const acorn = require("acorn");
const JSEmitter = require("./js-emitter");

const jsEmitter = new JSEmitter(); 

// 获取命令行参数
const args = process.argv.slice(2);
const buffer = fs.readFileSync(args[0]).toString();
const body = acorn.parse(buffer, {ecmaVersion: 2022}).body;
let decls = new Map();
let calledDecls = [];
let code = [];

// 添加作用域处理
const scope = new Map();

// 修改遍历处理逻辑
body.forEach((node) => {
  // 处理函数声明
  if (node.type === "FunctionDeclaration") {
    const code = jsEmitter.run([node]);
    const funcName = jsEmitter.visitNode(node.id);
    decls.set(funcName, code);
    scope.set(funcName, 'function');
    return;
  }

  // 处理变量声明
  if (node.type === "VariableDeclaration") {
    const kind = node.kind;
    for (const decl of node.declarations) {
      const varName = jsEmitter.visitNode(decl.id);
      decls.set(varName, jsEmitter.visitVariableDeclaration(decl, kind));
      scope.set(varName, kind);
    }
    return;
  }

  // 处理调用表达式
  if (node.type === "ExpressionStatement" && 
      node.expression.type === "CallExpression") {
    const callNode = node.expression;
    calledDecls.push(jsEmitter.visitIdentifier(callNode.callee));
    callNode.arguments.forEach(arg => {
      if (arg.type === "Identifier") {
        calledDecls.push(jsEmitter.visitIdentifier(arg));
      }
    });
  }

  // 处理标识符引用
  if (node.type === 'Identifier') {
    calledDecls.push(node.name);
  }

  // 收集其他代码
  code.push(jsEmitter.run([node]));
});

// 添加代码过滤逻辑
const usedDecls = new Set(calledDecls);
const finalCode = [];

// 只保留被使用的声明
for (const [name, code] of decls) {
  if (usedDecls.has(name)) {
    finalCode.push(code);
  }
}

// 添加其他代码
finalCode.push(...code);

// 修改输出方式
const outputFilename = args[0].replace('.js', '.min.js');
fs.writeFileSync(outputFilename, finalCode.join('\n'));
console.log(`Tree-shaken code written to ${outputFilename}`);
