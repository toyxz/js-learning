let promise1 = function() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log(1)
            resolve(1)
        },500)
    })
}
let promise2 = function(data) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log(data+1)
            resolve(data+1)
        },500)
    })
}
let promise3 = function(data) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log(data+1)
            resolve(data+1)
        },500)
    })
}

async function getUrl(promises) {
    let data = null;
    for (let promise of promises) {
        data = await promise(data) 
    }
}
getUrl([promise1,promise2,promise3])