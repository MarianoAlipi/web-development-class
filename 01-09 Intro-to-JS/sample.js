console.log("inside my file");
mySecondVar = 20;
console.log(mySecondVar);

// A function.
function myFirstFunc(argOne, argTwo) {
    console.log(argOne, argTwo);
}

myFirstFunc(10, "bla");

let secondFunc = function(argOne, argTwo) {
    console.log(argOne, argTwo);
}

// Default value for variables is undefined.
// Passing no parameters to the function results
// in undefined values.
secondFunc();

// Default value for a parameter.
function thirdFunc(argOne, argTwo="Default value") {
    console.log(argOne, argTwo);
}

thirdFunc(1);

// Arrow function.
// They work like lambdas in other languages.
// They are anonymous, and obviates the "function" and "return" keywords,
// as well as braces.
// The behavior of the "this" keyword also changes.
// In an arrow function, "this" refers to
// the normal scope of the function call.
let arrFunc = () => {
    console.log("Arrow function");
};

let arrFunc2 = (x, y) => { x * y };

// Immediately Invoked Function Expression (IIFE)
// This function is executed right after being declared.
(function (argOne) {
    console.log("IIFE arg: " + argOne);
})(123);