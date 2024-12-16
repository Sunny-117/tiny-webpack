const { RawSource } = require("webpack-sources");
const DelegatedSourceDependency = require("webpack/lib/dependencies/DelegatedSourceDependency");
const Module = require("webpack/lib/Module");
class DelegatedModule extends Module {
    constructor(sourceRequest, data,originalRequest) {
        super("javascript/dynamic", null);
        this.sourceRequest = sourceRequest;//dll-reference _dll_utils
        this.request = data.id;//{"id":"./node_modules/_is-promise@4.0.0@is-promise/index.js"}
        this.originalRequest = originalRequest;//老模块
    }
    libIdent(options) {//模块ID还是老的模块ID
        return this.originalRequest.libIdent(options);
    }
    identifier() {
        return `delegated ${this.request} from ${this.sourceRequest}`;
    }

    readableIdentifier() {
        return `delegated ${this.request} from ${this.sourceRequest}`;
    }
    size(){
        return 42;
    }
    build(options, compilation, resolver, fs, callback) {
        this.built = true;
        this.buildMeta = {};
        this.buildInfo = {};
        this.delegatedSourceDependency = new DelegatedSourceDependency(
            this.sourceRequest
        );
        this.addDependency(this.delegatedSourceDependency);
        callback();
    }
    source() {
        let str = `module.exports = (__webpack_require__("${this.sourceRequest}"))(${JSON.stringify(this.request)});`;
        return new RawSource(str);
    }
}
module.exports = DelegatedModule;
