console.log("this is base.js");
let a = (cl) => {
	console.log("this is ES5");
	cl && cl();
}
a(() => {
	console.log("this is callback");
}); 
