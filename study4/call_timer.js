var module = require('./custom_module_timer');

module.timer.on('tick', function (time) {
    var time = new Date();
    console.log('now:' + time);
});