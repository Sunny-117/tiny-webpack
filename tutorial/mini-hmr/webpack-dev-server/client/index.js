var hotEmitter = require('../../webpack/hot/emitter');
//通过websocket客户端连接服务器端
var socket = io();
//当前最新的hash值
var currentHash;
socket.on('hash',(hash)=>{
    console.log('客户端据此到hash消息');
    currentHash = hash;
});
socket.on('ok',()=>{
    console.log('客户端据此到ok消息');
    reloadApp();
});
function reloadApp(){
    hotEmitter.emit('webpackHotUpdate',currentHash);
}
