var EventEmitter = require('events');

var sec = 1;

exports.timer = new EventEmitter();

setInterval(function () {
    exports.timer.emit('tick');
}, sec * 1000);