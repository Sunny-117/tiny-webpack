import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import babel from "@babel/core";

const require = createRequire(import.meta.url);
const resolveSync = require("resolve").sync;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let ID = 0;

function createModuleInfo(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, { sourceType: "module" });

  const deps = [];
  traverse.default(ast, {
    ImportDeclaration: ({ node }) => {
      deps.push(node.source.value);
    },
  });

  const id = ID++;
  const { code } = babel.transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return { id, filePath, deps, code };
}

function createDependencyGraph(entry) {
  const entryInfo = createModuleInfo(entry);
  const graphArr = [entryInfo];

  for (const module of graphArr) {
    module.map = {};
    module.deps.forEach((depPath) => {
      const baseDir = path.dirname(module.filePath);
      const moduleDepPath = resolveSync(depPath, { basedir: baseDir });
      const moduleInfo = createModuleInfo(moduleDepPath);
      graphArr.push(moduleInfo);
      module.map[depPath] = moduleInfo.id;
    });
  }

  return graphArr;
}

function pack(graph) {
  const moduleArgArr = graph.map((module) => {
    return `${module.id}: {
      factory: (exports, require) => {
        ${module.code}
      },
      map: ${JSON.stringify(module.map)}
    }`;
  });

  return `(function(modules){
    const require = id => {
      const { factory, map } = modules[id];
      const localRequire = name => require(map[name]);
      const module = { exports: {} };
      factory(module.exports, localRequire);
      return module.exports;
    };
    require(0);
  })({${moduleArgArr.join(",")}});
  `;
}

export function bundle(input, output) {
  const graph = createDependencyGraph(input);
  const result = pack(graph);

  const distDir = path.resolve(__dirname, "dist");
  const outputPath = output ? output : path.join(distDir, "bundle.js");

  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(outputPath, result, "utf-8");

  console.log(`✅ 打包完成: ${outputPath}`);
  return result;
}
