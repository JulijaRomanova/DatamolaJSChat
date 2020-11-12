const addOneArgument = (a) => (b) => a + b;
const subOneArgument = (a) => (b) => b - a;
const mulOneArgument = (a) => (b) => a * b;
const divOneArgument = (a) => (b) => b / a;


function add(a, b) {
    return (arguments.length === 1 ? addOneArgument(a) : (a + b))
}

function sub(a, b) {
    return (arguments.length === 1 ? subOneArgument(a) : (a - b))
}

function mul(a, b) {
    return (arguments.length === 1 ? mulOneArgument(a) : (a * b))
}

function div(a, b) {
    return (arguments.length === 1 ? divOneArgument(a) : (a / b))
}


function pipe(){
    let res = arguments[arguments.length - 1];
    for (let i = arguments.length - 2; i >= 0; i--){
        res = res.call(null, arguments[i]);
    }
    return res;
}

let a = add(1, 2);
let b = mul(a, 10);
console.log('a = ', a);
console.log('b = ', b);
let sub1 = sub(1);
let c = sub1(b);
console.log('c = ', c);
let d = mul(sub(a,1))(c);
console.log('d = ', d);
let div2 = div(2);
let e = div2(d);
console.log('e = ', e);
console.log(pipe(add(d, 0), sub(c)));
