### 如何判断this？（包括讨论在严格模式和非严格模式）


先不讨论严格模式和非严格模式，注意'use strict'要要么放在文件开头，要么放在函数内部，否则不起作用

JavaScript高级程序设计中有下面这一句话：
>在严格模式下，未指定环境对象而调用函数，则 this 值不会转型为 window。 除非明确把函数添加到某个对象或者调用 apply()或 call()，否则 this 值将是 undefined。


this的判断我认为一般来说有几种情况：

1、普通函数调用，则this一般指向window（node下为 global ）
```js
// 严格模式
'use strict'
function outer() {
    function inner() {
        console.log(this)  // 
    }
    inner()
}
outer()
// 非严格模式 输出 global对象或者window对象（node和browser）
// 严格模式 输出 undefined
```
2、对象方法中调用，则this指向这个对象
```js
var obj={
    'name':'yy',
    'age':'18',
    'val':function(){
        'use strict'   // 严格模式和非严格模式下都是指向obj这个对象
        return this;
    }
}
console.log(obj.val()) // { name: 'yy', age: '18', val: [Function: val] }
```
3、箭头函数调用
箭头函数没有自己的this, 它的this是继承而来; 默认指向在定义它时所处的对象(宿主对象）
```js
var obj={
    'name':'yy',
    'age':'18',
    'val': () => {
        console.log(this)
    },
    'other': function() {
        return () => {
            console.log(this)
        }
    }
}
obj.val() // {}  返回一个空对象
obj.other()() // { name: 'yy',age: '18',val: [Function: val],other: [Function: other] }  这是由于外部函数的this指向对应的对象
```

4、在异步环境或者定时器环境下，this不指向原来的环境，而是函数执行时的外层函数

严格模式下：
```js
var obj={
    'name':'yy',
    'age':'18',
    'val': () => {
        console.log(this)
    },
    'other': function() {
        'use strict'
        setTimeout( () => {
            console.log(this)
        },0)
    },
    'another': function() {
        'use strict'
        setTimeout(function(){
            console.log(this)
        },0)
    }
}
obj.other() // obj 对象
obj.another() // 在node下无论是不是严格模式都返回一个Timeout对象！神奇吧！而browser环境下会返回window
```

5、当函数被重新赋值时.在严格模式下，如果是箭头函数的话，this会被赋值为箭头函数外部函数对应的那个this对象，而普通函数的话，则仍然是undefined
```js
var obj={
    'name':'yy',
    'age':'18',
    'val': () => {
        return this;
    },
    'other': function() {
        'use strict'
        return () => {      
            console.log(this)
        }
    }
    'another': function() {
        'use strict'
        return function() {       
            console.log(this)
        }
    }
}
var fn2 = obj.other() 
fn2() // 返回obj 对象，箭头函数使得this绑定到‘other'方法对应的this对象
var fn3 = obj.another()
fn3() // undefined
```

6、call,apply,bind(ES5新增)绑定的,this指的是 绑定的对象
```js
var obj={
    'name':'yy',
    'age':'18',
    'val': function() {
        console.log(this)
    }
}
obj.val()    // { name: 'yy', age: '18', val: [Function: val] }
var fn = obj.val;
fn();  // 全局对象
fn.call(obj) // { name: 'yy', age: '18', val: [Function: val] }
```