const { ExternalModule } = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
/**
 * 1.需要向输出html文件中添加CDN脚本引用
 * 2.在打包生产模块的时候，截断正常的打包逻辑，变成外部依赖模块
 */
class AutoExternalPlugin{
  constructor(options){
    this.options = options;
    this.externalModules = Object.keys(this.options);//['jquery'] 进行自动外键的模块
    this.importedModules = new Set();//存放着所有的实际真正使用到的外部依赖模块
  }
  apply(compiler){
    //每种模块会对应一个模块工厂 普通模块对应的就是普通模块工厂
    //https://webpack.docschina.org/api/normalmodulefactory-hooks/
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin',(normalModuleFactory)=>{
      //https://webpack.docschina.org/api/parser/#root
      normalModuleFactory.hooks.parser
        .for('javascript/auto')//普通 的JS文件对应的钩子就是'javascript/auto'
        .tap('AutoExternalPlugin',parser=>{
          //在parser遍历语法的过程中，如果遍历到了import节点
          //https://webpack.docschina.org/api/parser/#import
          parser.hooks.import.tap('AutoExternalPlugin',(statement,source)=>{
            if(this.externalModules.includes(source)){
              this.importedModules.add(source);
            }
          });
          //https://webpack.docschina.org/api/parser/#call
          //call=HookMap key方法名 值是这个方法对应的钩子
          parser.hooks.call.for('require').tap('AutoExternalPlugin',(expression)=>{
            let value = expression.arguments[0].value;
            if(this.externalModules.includes(value)){
              this.importedModules.add(value);
            }
          });
        })
      //2.改造模块的生产过程，如果是外链模块，就直接生产一个外链模块返回
      //https://webpack.docschina.org/api/normalmodulefactory-hooks/
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin',(resolveData,callback)=>{
        let {request} = resolveData;//模块名 jquery lodash
        if(this.externalModules.includes(request)){
          let {variable} = this.options[request];
          //request=jquery window.jQuery
          callback(null,new ExternalModule(variable,'window',request));
        }else{
          callback(null);//如果是正常模块，直接向后执行。走正常的打包模块的流程
        }
      });
    });
    //是往输出的HTML中添加一个新的CDN Script标签
    compiler.hooks.compilation.tap('AutoExternalPlugin',(compilation)=>{
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin',(htmlData,callback)=>{
        //console.log(JSON.stringify(htmlData,null,2));
        Reflect.ownKeys(this.options).filter(key=>this.importedModules.has(key)).forEach(key=>{
          //jquery
          htmlData.assetTags.scripts.unshift({
            tagName:'script',
            voidTag:false,
            attributes:{
              defer:false,
              src:this.options[key].url
                        }
                    });
                })
                callback(null,htmlData);
            });
        });

    }
}
module.exports = AutoExternalPlugin;
/**
 * Node {
  type: 'ImportDeclaration',
  start: 0,
  end: 23,
  loc: SourceLocation {
    start: Position { line: 1, column: 0 },
    end: Position { line: 1, column: 23 }
  },
  range: [ 0, 23 ],
  specifiers: [
    Node {
      type: 'ImportDefaultSpecifier',
      start: 7,
      end: 8,
      loc: [SourceLocation],
      range: [Array],
      local: [Node]
    }
  ],
  source: Node {
    type: 'Literal',
    start: 14,
    end: 22,
    loc: SourceLocation { start: [Position], end: [Position] },
    range: [ 14, 22 ],
    value: 'jquery',
    raw: "'jquery'"
  }
}
jquery
 */
