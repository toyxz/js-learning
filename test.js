const data = [1,4,5,6,1,8,2]

data.forEach(a => {
    setTimeout(() => {
        console.log(a)
    },a)
})
// for (let a of data) {
//     setTimeout(() => {
//         console.log(a)
//     },a)
// }