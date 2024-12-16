const HtmlWebpackPlugin = require("html-webpack-plugin");
compiler.hooks.compilation.tap('AutoDllPlugin', function (compilation) {
  if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
    compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync('AutoDllPlugin', doCompilation);
  } else if (HtmlWebpackPlugin.getHooks && HtmlWebpackPlugin.getHooks(compilation)) {
    HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync('AutoDllPlugin', doCompilation);
  }
});
