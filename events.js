var events = require('events');

var event = new events.EventEmitter();

event.on('first', function(a, b){
	console.log(a + b);
});

var x = event.emit('first', 2, 3);

