var a = process.argv[2];
var b = process.argv[3];

function x(a, b){
	return parseInt(a) + parseInt(b);
};

console.log(x(a,b));

// function foo(){
// 	throw new Error('oops!');
// };

// function bar(){
// 	foo();
// };

// function baz(){
// 	bar();
// };

// baz();