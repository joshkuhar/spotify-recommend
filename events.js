var events = require('events');


// var First = function(number){
// 	var event = new events.EventEmitter();
// 	if (number){
// 		event.emit('end', number);
// 	}
// };

// var first = First(8);
// first.on('end', function(a){
// 	console.log(a);
// });

// var x = event.emit('end', 3);


var array = ['one', 'two', 'three'];
function logEm(element, index, array){
  console.log(index + ':' + element);
};

array.forEach(logEm);