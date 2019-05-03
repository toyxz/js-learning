#### callback hell

实际项目中，如何解决这种深层次的 callback 嵌套
```js
    ajax({
        url: '//max.m.taobao.com/mtop/myapi/1',
        data: {
            name: val
        },
        success: (res1) => {
            let { val1 } = res1 || {};

            ajax({
                url: '//max.m.taobao.com/mtop/myapi/2',
                data: {
                    name1: val1
                },
                success: (res2) => {
                    let { val2, val3 } = res2 || {};

                    ajax({
                        url: '//max.m.taobao.com/mtop/myapi/3',
                        data: {
                            name2: val2,
                            name3: val3
                        },
                        success: (res3) => {
                            // 拿到res3 更新DOM结构

                            // 
                        }
                    })
                }
            })
        }
    })
```

#### Promise
使用promise解决有依赖关系的顺序异步执行（使用 setTimeout 模拟）
```js
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
    // promise
    promise1
        .then(data => {
            return promise2(data)
        })
        .then(data => {
            return promise3(data)
        })
        .then(data => {
            console.log(data)
        })
```
#### generator
为了模拟 采用promise 而且axios也是利用promise类型
```js
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
    function * Getgenerator() {
        let data1 = yield promise1()
        let data2 = yield promise2(data1)
        let data3 = yield promise3(data2)
        return data3
    }
    // generator
    let it = Getgenerator()
    it.next().value
    .then(data => {
        return it.next(data).value
    })
    .then(data => {
        return it.next(data).value
    })
    .then(data => {
        console.log(data+1)
    })
```
#### async await
```js
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
// async await
async function getUrl(promises) {
    let data = null;
    for (let promise of promises) {
        data = await promise(data) 
    }
}
getUrl([promise1,promise2,promise3])
```

## EventLoop
```js
async function async1() {
    console.log('async1 start')
    var a = await 1
    console.log(a)
    console.log('async end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function() {
    console.log('setTimeout')
},1)
async1()
new Promise(function(resolve) {
    console.log('promise1')
    resolve()
}).then(function(){
    console.log('promise then')
})
console.log('script end')
// script start
// async1 start
// promise1
// script end
// 1
// async end
// promise then
// setTimeout
```