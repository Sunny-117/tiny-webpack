1. 为什么说loader的执行是从右向左,从下向上

2. 为什么要分成四种loader?顺序不同，可以通过enforce来指定顺序
loader类型不同会决定执行顺序的，因为loader的配置是分散的,它可能会由多个配置文件合并而来
> 像eslint要先执行，因为babel编译完在检查就没意义了

如何实现的？


如果pitch中返回：

![](2024-12-27-21-53-52.png)

```js
normal.pitch = function(remainingRequest,previousRequest,data){
    return 'inline1-pitch'
}
```
