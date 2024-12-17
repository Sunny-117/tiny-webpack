module.exports = class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("RunPlugin", () => {
      console.log("RunPlugin");
    });
  }
}
