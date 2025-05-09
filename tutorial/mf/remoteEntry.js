window.teamb = (() => {
    var modules = ({
        "webpack/container/entry/teamb":
            ((module, exports, require) => {
                var moduleMap = {
                    "./Dropdown": () => {
                        return Promise.all([require.e("webpack_sharing_consume_default_is-array_is-array"), require.e("src_Dropdown_js")]).then(() => () => require("./src/Dropdown.js"));
                    },
                    "./Button": () => {
                        return Promise.all([require.e("webpack_sharing_consume_default_is-array_is-array"), require.e("src_Button_js")]).then(() => () => require("./src/Button.js"));
                    }
                };
                var get = (module) => {
                    return moduleMap[module]();
                };
                //初始化作用域
                var init = (shareScope) => {
                    var name = "default";
                    require.S[name] = shareScope;
                    return require.I(name);
                };
                require.d(exports, {
                    get: () => get,
                    init: () => init
                });
            })
    });
    var cache = {};
    function require(moduleId) {
        if (cache[moduleId]) {
            return cache[moduleId].exports;
        }
        var module = cache[moduleId] = {
            exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }
    require.n = (module) => {
        var getter = module && module.__esModule ?
            () => module['default'] :
            () => module;
        return getter;
    };
    require.d = (exports, definition) => {
        for (var key in definition) {
            Object.defineProperty(exports, key, { get: definition[key] });
        }
    };
    require.f = {};
    require.e = (chunkId) => {
        return Promise.all(Object.keys(require.f).reduce((promises, key) => {
            require.f[key](chunkId, promises);
            return promises;
        }, []));
    };
    require.u = (chunkId) => {
        return "" + chunkId + ".js";
    };
    require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    require.l = (url, done) => {
        var script = document.createElement('script');
        script.src = url;
        script.onload = done
        document.head.appendChild(script);
    };
    require.r = (exports) => {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    require.S = {};
    require.I = (name) => {
        if (require.S[name])
            return Promise.resolve();
    };
    require.p = "http://localhost:8000/";
    //初始化作用域
    var init = (fn) => function (scopeName, key, version) {
        //先保证作用域存在
        return require.I(scopeName).then(() => {
            //返回作用域指定版本对应的模块
            return fn(require.S[scopeName], key, version);
        });
    };
    //加载共享作用域
    var loadShareScope = init((scope, key, version) => {
        //获取版本
        var versions = scope[key];
        //获取指定版本
        var entry = versions[version];
        return entry.get()
    });
    (() => {
        var moduleToHandlerMapping = {
            "webpack/sharing/consume/default/is-array/is-array": () => loadShareScope("default", "is-array", '1.0.1')
        };
        var chunkMapping = {
            "webpack_sharing_consume_default_is-array_is-array": [
                "webpack/sharing/consume/default/is-array/is-array"
            ]
        };
        require.f.consumes = (chunkId, promises) => {
            if (require.o(chunkMapping, chunkId)) {
                chunkMapping[chunkId].forEach((id) => {
                    let promise = moduleToHandlerMapping[id]().then((factory) => {
                        modules[id] = (module) => {
                            module.exports = factory();
                        }
                    })
                    promises.push(promise);
                });
            }
        }
    })();
    var installedChunks = {
        "teamb": 0
    };
    require.f.j = (chunkId, promises) => {
        if ("webpack_sharing_consume_default_is-array_is-array" != chunkId) {
            var promise = new Promise((resolve, reject) => {
                installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(promise);
            var url = require.p + require.u(chunkId);
            require.l(url);
        }
    };
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
        var [chunkIds, moreModules, runtime] = data;
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (require.o(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (require.o(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (runtime) runtime(require);
        if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    }
    var chunkLoadingGlobal = self["webpackChunkteamb"] = self["webpackChunkteamb"] || [];
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    return require("webpack/container/entry/teamb");
})();