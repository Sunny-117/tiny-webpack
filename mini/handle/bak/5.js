const async = require('neo-async');

let arr = [1,2,3];
console.time('cost');//Promise.all
forEach(arr,function(item,callback){
    setTimeout(function(){
        callback();
    },1000*item);
},function(){
 console.timeEnd('cost');
});

function forEach(arr,callback,finalCallback){
    let count = arr.length;
    function done(){
        if(--count ==0)
           finalCallback();
    }
    arr.forEach(function(item){
        callback(item,done);
    })
}
/// path.dirname join relative