const DelegatedSourceDependency = require("webpack/lib/dependencies/DelegatedSourceDependency");
const ExternalModuleFactoryPlugin = require("./ExternalModuleFactoryPlugin");
const DelegatedModuleFactoryPlugin = require("./DelegatedModuleFactoryPlugin");
class DllReferencePlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(
            "DllReferencePlugin",
            (compilation, { normalModuleFactory }) => {
                compilation.dependencyFactories.set(
                    DelegatedSourceDependency,
                    normalModuleFactory
                );
            }
        );

        compiler.hooks.compile.tap("DllReferencePlugin", ({normalModuleFactory}) => {
            let manifest = this.options.manifest;
            let name = manifest.name;//_dll_utils
            let content = manifest.content;//{'is-promise':'','isarray':''}
            //外部模块  "dll-reference _dll_utils"引用window._dll_utils
            const externals = {};
            const source = "dll-reference " + name;//dll-reference _dll_utils
            externals[source] = name;//dll-reference _dll_utils=>_dll_utils
      new ExternalModuleFactoryPlugin("var", externals).apply(normalModuleFactory);

            new DelegatedModuleFactoryPlugin({
                source,
                context: compiler.options.context,
                content
            }).apply(normalModuleFactory);
        });
    }
}

module.exports = DllReferencePlugin;
