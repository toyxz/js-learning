function fun(args) {
    console.log(args)
    let  {test,...arr} = args;
    console.log(arr)
}
let r = {
    test: {x:1},
    tt: {y:1},
    xx: {o:2}
}

fun(r)
// fun(1,2,3,4,5)
// fun(15,3,4,3,4,5)
