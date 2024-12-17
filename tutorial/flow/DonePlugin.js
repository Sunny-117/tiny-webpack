module.exports = class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("DonePlugin", () => {
      console.log("DonePlugin");
    });
  }
};
