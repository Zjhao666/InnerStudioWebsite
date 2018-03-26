var fs = require("fs");
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});
console.log("程序执行结束!");


//event.js 文件
var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent', function(arg1, arg2) {
    console.log('listener1', arg1, arg2);
});
emitter.on('someEvent', function(arg1, arg2) {
    console.log('listener2', arg1, arg2);
});
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数');


buf = Buffer.alloc(256);
len = buf.write("www.runoob.com");
buf.toJSON()
console.log( buf.toString(undefined,0,5)); // 使用 'utf8' 编码, 并输出: abcde
buf.slice([start[, end]])
