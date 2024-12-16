const SingleEntryDependency = require("webpack/lib/dependencies/SingleEntryDependency");
const DllEntryDependency = require("./dependencies/DllEntryDependency");
const DllModuleFactory = require("./DllModuleFactory");
class DllEntryPlugin {
    constructor(context, entries, name) {
        this.context = context;// c:/aprepare/sunny_dll_prepare
        this.entries = entries;// ['isarray', 'is-promise']
        this.name = name; // utils
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(
            "DllEntryPlugin",
            (compilation, { normalModuleFactory }) => {
                const dllModuleFactory = new DllModuleFactory();
                compilation.dependencyFactories.set(
                    DllEntryDependency,
                    dllModuleFactory
                );
                compilation.dependencyFactories.set(
                    SingleEntryDependency,
                    normalModuleFactory
                );
            }
        );
        compiler.hooks.make.tapAsync("DllEntryPlugin", (compilation, callback) => {
            compilation.addEntry(
                this.context,
                new DllEntryDependency(
                    this.entries.map((entry) => new SingleEntryDependency(entry)),
                    this.name//utils
                ),
                this.name,//utils
                callback
            );
        });
    }
}
module.exports = DllEntryPlugin;
