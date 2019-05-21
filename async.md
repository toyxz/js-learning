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

## async
> 下面具体总结一些知识点

我们需要了解到一点，ajax是可以发送同步请求的，怎么发送呢？就是使用回调函数。我之前在项目中也是这么使用的，但是发送同步请求会锁定浏览器UI（按钮、菜单、滚动条等），并阻塞所有的用户交互。（之前的业务代码就是利用同步请求，维护超级恶心）

#### 异步控制台
在某些条件下，某些浏览器的console.log()并不会把传入的内容立即输出。出现这种情况的原因是，在许多程序（不只是JavaScript）中，**I/O是非常低速的阻塞部分**。所以，（从页面UI的角度来说）浏览器在后台异步处理控制台I/O能够提高性能，这时用户甚至可能根本意识不到其发生。(注意，只是在很少的情况下才会发生)
--解决方案：断点、对象序列化（强制快照）

#### 事件循环
>直到（ES6）,JavaScript才真正内建有直接的异步概念。

what？！

JavaScript引擎本身没有时间的概念，只是一个按需执行JavaScript任意代码片段的环境。

>“直到最近”的意思是指ES6从本质上改变了在哪里管理事件循环。本来它几乎已经是一种正式的基数模型了，但现在```ES6精确指定了事件循环的工作细节```，这意味着在技术上将其归纳入 JavaScript 引擎的势力范围，而不是只由宿主环境来管理。这个改变的一个主要原因是ES6中Promise的引入，因为这项技术要求对事件循环队列的调度运行能够直接运行精细控制。

#### 并行线程
并行线程的交替执行和异步事件的交替调度，其粒度是完全不同的。

在单线程环境中，线程队列中的这些项目是底层运算却是是无所谓的。

**JavaScript从不跨线程共享数据。**

在JavaScript的特性中，这种函数顺序的不确定性就是通常所说的**竞态条件**。

## 并发
>有一个场景，有一个展示状态更新的列表，其随着用户向下滚动列表而逐渐加载更多内容。

这个过程可以分为两个“进程”
* 第一个“进程”是用户向下滚动页面触发onscroll事件时响应这些事件（发起Ajax请求要求新的内容）
* 第二个“进程”接收Ajax响应（把内容展示到页面）

如果用户向下滚动页面足够快的话，在等待第一个响应返回并处理的时候可能会看到两个或更多onscroll事件被触发。
（如果获取的内容比较大的话，内存可能会爆...，特别是移动端这种内存小的设备）
（解决方案可以考虑一下 节流 ）。这里要讨论的问题不是数据量的问题，而是数据顺序的问题。

并发情况下，对于不同响应数据顺序问题可以分为两个方面“非交互”和”交互“。

”非交互“指的是 如果两个”进程“对共享数据没有顺序（处理）要求，那么前面提到的顺序的不确定性是完全可以接收的，这种情况称为”非交互“型并发。

”交互“指的是 ”进程“之间需要相互交流，需要对同一个共享数据进行处理，而且处理的顺序不同，得到的结果也不同。
**如果出现这样的交互，就需要对它们的交互进行协调以避免竞态的出现**。

##### 解决方案
可以协调交互顺序来处理这样的竞态条件：
```js
var res = [];
function response(data) {
    if (data.url == "http://some.url.1") {
        res[0] = data;
    } else if (data.url == "http://some.url.2") {
        res[1] = data;
    }
}
ajax("xxx1",response);
ajax("xxx2",response);
```
通过简单的协调，就可以避免了竞态条件引起的不确定性

```js
// 为了避免出错做的竞态处理
var a,b;
function foo(x) {
    a = x * 2;
    if (a && b) {
        baz();
    }
}
function bar(y) {
    b = y * 2;
    if (a && b) {
        baz();
    }
}
function baz() {
    // ...
}
ajax("xxx1",foo);
ajax("xxx2",bar);
```

当竞态条件是“第一名有效，其他响应无效”的情况，那么可以使用```if(!a)```这种方法避免重复处理响应数据，做到只处理一次

### 协作
还有一种并发合作方式，称为并发协作。这里的重点不再是通过共享作用域中的值进行交互（尽管显然这也是允许的！）。这里的目标是取到一个长期运行的“进程”，并将其分割成多个步骤或多批任务，使得其他并发“进程”有机会将自己的运算插入到事件循环队列中交替运行。
（俗话就是说有一个“进程”处理太久了，为了避免其他“进程”饿死，让出“CPU时间片”）

**协作的实现方式**
>异步批处理这些结果

这里有一个非常简单的方法：
(感觉给出了一种处理大数据的方法，不过网络请求不可能一次性)
```js
var res = [];

// response(...) 从Ajax调用中取得结果数组
function response(data) {
    // 一次处理1000个
    var chunk = data.splice(0,1000);
    // 添加到已有的res数组
    res = res.concat(
        // 创建一个新的数组把chunk中所有值加倍
        chunk.map( function(val) {
            return val * 2;
        })
    )
    // 还有剩下的需要处理吗？
    if (data.length > 0) {
        // 异步调度下一次批处理
        setTimeout( function() {
            response( data ); 
        },0);
    }
}
ajax("xxx1",response);
ajax("xxx2",response);
```

### 任务
在ES6中，有一个新的概念建立在事件循环队列之上，叫做**任务队列**

对于任务队列最好的理解方式就是，它是挂在事件循环队列的每个tick之后的一个队列。事件循环的每个tick中，可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中，而会在当前tick的任务队列末尾添加一个项目（一个任务）

通过使用断点和单步执行一行一行地遍历代码，JavaScript调试器就是用来发现这样bug的最强大的工具

**JavaScipt引擎在编译期间执行的都是安全的优化**

> JavaScipt程序总是至少分为两个块：第一个现在运行，下一块将来运行，以响应某个事件。尽管程序是一块一块执行的。但是这些块共享对程序作用域和状态的访问，所以对状态的修改都是在之前累计的修改之上进行的。

>一旦有事件需要运行，事件循环就会运行，直到队列清空。事件循环的每一轮称为一个tick。
用户交互、IO和定时器会向事件队列中加入事件。

>通常需要对这些并发执行的“进程”（有别于操作系统中的进程概念）进行某种形式的交互协调，比如需要确保执行顺序或者需要防止竞态出现。这些“进程”也可以通过自身分割为更小的块，以便其他“进程”插入进来。


#### 信任问题
把自己程序的一部分的执行控制交给某个第三方，这叫做**控制反转**

## Promise
Promise是一种封装和组合未来值的易于复用的机制
























generator....
```js
var a = 1;
var b = 2;
function *foo() {
    a++;
    yield;
    b = b * a; 
    a = (yield b) + 3;
}
function *bar() {
    b--;
    yield; 
    a = (yield 8) + b;
    b = a * (yield 2);

}
function step(gen) {
    var it = gen();
    var last;
    return function() {
        last = it.next(last).value;
    };
}

var s1 = step(foo);
var s2 = step(bar);

s2(); // b:1
s2(); // yield 8
s1(); // a:2
s2(); // a=8+b=9 yield 2
s1(); // b=b*a=9 yield 9
s1(); // a=b+3=12 
s2(); // b=a*yield 2   
console.log(a,b); // 12, 18

// 最后一个函数调用的时候 我计算错误，因为忘记 yield 2 之前 a已经被赋值为 9 而不是s1操作后的 12

```