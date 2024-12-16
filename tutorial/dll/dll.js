const webpack = require("webpack");
const webpackOptions = require("./webpack.dll.config");
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(
    stats.toJson({})
  );
});
