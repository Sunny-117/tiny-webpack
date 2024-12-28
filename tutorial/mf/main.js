(() => {
    //模块定义
    var modules = ({
        "webpack/container/reference/teamb": ((module, exports, require) => {
            //加载远程脚本，返回 window.teamb
            module.exports = new Promise((resolve) => {
                require.l("http://localhost:8000/remoteEntry.js", resolve);
            }).then(() => window.teamb);
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
    //如果在ES module,取default，否则取自己
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
    require.u = (chunkId) => {
        return "" + chunkId + ".js";
    };
    require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
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
    require.f = {};
    require.e = (chunkId) => {
        return Promise.all(Object.keys(require.f).reduce((promises, key) => {
            require.f[key](chunkId, promises);
            return promises;
        }, []));
    };
    (() => {
        //远程模块的代码码映射
        var chunkMapping = {
            "webpack_container_remote_teamb_Dropdown": [
                "webpack/container/remote/teamb/Dropdown"
            ],
            "webpack_container_remote_teamb_Button": [
                "webpack/container/remote/teamb/Button"
            ]
        };
        var idToExternalAndNameMapping = {
            "webpack/container/remote/teamb/Dropdown": [
                "default",//命名空间
                "./Dropdown",//导出的名称
                "webpack/container/reference/teamb"//来自哪个外部模块
            ],
            "webpack/container/remote/teamb/Button": [
                "default",
                "./Button",
                "webpack/container/reference/teamb"
            ]
        };
        //加载远程模块
        require.f.remotes = (chunkId, promises) => {
            //如果是外部模块，则加载
            if (require.o(chunkMapping, chunkId)) {
                //获取外部模块的id
                chunkMapping[chunkId].forEach((id) => {
                    //获取外部模块的名称 scopeName 作用域名称 remoteExposeName远程暴露的名称 远程ID
                    var [scopeName, remoteExposeName, remoteId] = idToExternalAndNameMapping[id];
                    //获取外部模块的代码
                    let promise = require(remoteId).then(external => {
                        //获取external外部变量，初始化作用域
                        return require.I(scopeName).then(() => {
                            //获取远程暴露的模块定义
                            return external.get(remoteExposeName).then(factory => {
                                //获取远程暴露的模块实例
                                modules[id] = (module) => {
                                    //执行工厂方法，获取远程模块实例
                                    module.exports = factory();
                                }
                            });
                        });
                    });
                    promises.push(promise);
                });
            }
        }
    })();
    //存放scope
    require.S = {};
    //初始化scope
    require.I = (name) => {
        if (require.S[name])
            return Promise.resolve();
        var scope = require.S[name] = {};
        //注册共享模块
        var register = (name, version, factory) => {
            var currentScope = scope[name] = scope[name] || {};
            currentScope[version] = { get: factory };
        };
        var promises = [];
        //初始化远程外部模块
        var initExternal = (id) => {
            var module = require(id);
            let promise = module.then(module => module.init(scope));
            promises.push(promise);
        }
        //scope的名称
        switch (name) {
            case "default": {
                register("is-array", "1.0.1", () => require.e("node_modules_is-array_index_js").then(() => () => require("./node_modules/is-array/index.js")));
                initExternal("webpack/container/reference/teamb");
            }
                break;
        }
        return Promise.all(promises)
    };
    require.p = "http://localhost:8000/";
    var init = (fn) => function (scopeName, key, version) {
        return require.I(scopeName).then(() => {
            return fn(require.S[scopeName], key, version);
        });
    };
    var loadShareScope = init((scope, key, version) => {
        var versions = scope[key];
        var entry = versions[version];
        return entry.get()
    });
    (() => {
        //share scope consumed modules
        var moduleToHandlerMapping = {
            "webpack/sharing/consume/default/is-array/is-array": () => loadShareScope("default", "is-array", '1.0.1')
        };
        var chunkMapping = {
            "src_bootstrap_js": [
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
        "main": 0
    };
    require.f.j = (chunkId, promises) => {
        if (!/^webpack_container_remote_teamb_(Button|Dropdown)$/.test(chunkId)) {
            var promise = new Promise((resolve, reject) => {
                installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(promise);
            var url = require.p + require.u(chunkId);
            require.l(url);
        }
    };
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
        var [chunkIds, moreModules] = data;
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
        if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    }
    var chunkLoadingGlobal = self["webpackChunkteama"] = self["webpackChunkteama"] || [];
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    require.e("src_bootstrap_js").then(require.bind(require, "./src/bootstrap.js"));
})();
