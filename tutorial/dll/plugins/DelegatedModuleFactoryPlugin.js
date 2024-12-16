const DelegatedModule = require("./DelegatedModule");
class DelegatedModuleFactoryPlugin {
    constructor(options) {
        this.options = options;
        options.type = options.type || "require";
    }
    apply(normalModuleFactory) {
        normalModuleFactory.hooks.module.tap(
            "DelegatedModuleFactoryPlugin",
            module => {
                if (module.libIdent) {
                    const request = module.libIdent(this.options);
                    if (request && request in this.options.content) {
                        const resolved = this.options.content[request];
                        return new DelegatedModule(
                            this.options.source,//dll-reference _dll_utils
                            resolved,//{"id":"./node_modules/_is-promise@4.0.0@is-promise/index.js"}
                            module//老模块
                        );
                    }
                }
                return module;
            }
        );
    }
}
module.exports = DelegatedModuleFactoryPlugin;
