const { Tapable } = require("tapable");
const DllModule = require("./DllModule");
class DllModuleFactory extends Tapable {
    constructor() {
        super();
        this.hooks = {};
    }
    create(data, callback) {
        const dependency = data.dependencies[0];
        callback(
            null,
            new DllModule(
                data.context,
                dependency.dependencies,// [SingleEntryDependency, SingleEntryDependency]
                dependency.name,//utils
                dependency.type//'dll entry'
            )
        );
    }
}
module.exports = DllModuleFactory;
