const Dependency = require("webpack/lib/Dependency");
class DllEntryDependency extends Dependency {
    constructor(dependencies, name) {
        super();
        this.dependencies = dependencies;//[SingleEntryDependency,SingleEntryDependency ]
        this.name = name;//utils
    }
    get type() {
        return "dll entry";
    }
}
module.exports = DllEntryDependency;
