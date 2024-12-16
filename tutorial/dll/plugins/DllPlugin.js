const DllEntryPlugin = require("./DllEntryPlugin");
const LibManifestPlugin = require("./LibManifestPlugin");
class DllPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.entryOption.tap("DllPlugin", (context, entry) => {
            Object.keys(entry).forEach(name => {
                new DllEntryPlugin(context, entry[name],name).apply(compiler);
            });
            return true;
        });
        new LibManifestPlugin(this.options).apply(compiler);
    }
}
module.exports = DllPlugin;
