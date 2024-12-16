const { RawSource } = require("webpack-sources");
const Module = require("webpack/lib/Module");
class DllModule extends Module {
    constructor(context, dependencies, name, type) {
        super("javascript/dynamic", context);//c:/aprepare/sunny_dll_prepare2
        this.dependencies = dependencies;
        this.name = name;//utils
        this.type = type;//dll entry
    }
    identifier() {
        return `dll ${this.name}`;
    }
    readableIdentifier() {
        return `dll ${this.name}`;
    }
    build(options, compilation, resolver, fs, callback) {
        this.built = true;
        this.buildMeta = {};
        this.buildInfo = {};
        return callback();
    }
    source() {
        return new RawSource("module.exports = __webpack_require__;");
    }
    size() {
        return 12;
    }
}
module.exports = DllModule;
