console.log("this is base.js");
let a = () => {
	console.log("this is cES6");
};
function a(cl){
	console.log("this is ES5");
	cl && cl();
}
a(() => {
	console.log("this is callback");
}); 
