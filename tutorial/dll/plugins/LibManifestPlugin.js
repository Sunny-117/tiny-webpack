const path = require("path");
const asyncLib = require("neo-async");
class LibManifestPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            "LibManifestPlugin",
            (compilation, callback) => {
                asyncLib.forEach(
                    compilation.chunks,
                    (chunk, done) => {
                        // c:aprepare/sunny_dll_prepare/dist/utils.manifest.json
                        const targetPath = this.options.path;
                        const name =this.options.name;//_dll_utils
                        let content ={};
                        for(let module of chunk.modulesIterable){
                            if (module.libIdent) {
                                const ident = module.libIdent({context:compiler.options.context});
                                content[ident]= {id: module.id};
                            }
                        }
                        const manifest = {name,content};//name=_dll_utils
                        compiler.outputFileSystem.mkdirp(path.dirname(targetPath), err => {
                            compiler.outputFileSystem.writeFile(
                                targetPath,
                                JSON.stringify(manifest),
                                done
                            );
                        });
                    },
                    callback
                );
            }
        );
    }
}
module.exports = LibManifestPlugin;
