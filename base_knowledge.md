强类型又被称为**静态类型**

js是用var 等统一关键字声明的，那为什么说js是有类型的呢？
——因为类型主要定义的是值的行为可以使其区分其他值

```变量没有类型，它们持有的值才有类型```

## 类型
现有其中内置类型
* null
* undefined
* string
* boolean
* number
* object
* Symbol

使用```typeof```可以判断类型，得到的是对应类型的字符串
```js
    typeof undefined == 'undefined' // true
    typeof null == 'object' // true
    typeof '42' == 'string'
    typeof 42 == 'number'
    typeof true == 'boolean'
    typeof Symbol() == 'symbol'
```
typeof null 的正确结果应该返回'null'，但是这个bug一直没有修复，可能以后也不会修复，因为涉及到太多web系统了。

##### 判断null
```js
    var a = null
    (!a && typeof a == 'object') // true
    // 如果a = {} 则 !a 是 false
```
#### 判断function
```typeof function a(){} == 'function' // true```
这是由于function 是object 的一个```子类型```,具体来说，函数是```可调用对象```，内部拥有属性
```js
typeof function a(){} // function
```
#### 判断数组
```数组也是object的一个子类型```
```js
typeof [1,2,3] == 'object' // true
```
> 在对变量进行 ```typeof ```操作时，得到的结果并不是该变量的类型，而是该```值```的类型
```js
typeof typeof 42 // 'string'
```
#### undefined 和 undeclared 是不一样的
未初始化和未声明是不一样的
* 已经在作用域中声明但是没有赋值的变量，是undefined
* 没有在作用域中声明过的变量 是undeclared

如果一个值没有声明，，报错```xx is not defined```
此时```typeod xxx // undefined```此时并没有报错，则是由于typeof有一个```安全的防范机制```

如何在程序中检查全局变量才不会出现```ReferenceError```
不宜用
```if (xxx)```
而是应该用
```if (typeof xxx !== 'undefined')```

这种机制有利于内建API，比如：
```js
if (a in window) {
    var a = 'xxx'
}
// 这里会导致变量提升。然后if语句正常执行，并且赋值，这可能会导致会我们想要的目的不同
```
不用typeof 来检查所有全局变量是否是全局对象的属性可以：
```js
if (window.xxx) {}
if (!window.xxx) {}
// 但是这种情况并不使用于所有环境，譬如说node的全局对象就不是window而是global
```

## 值



 <!-- 农村淘宝是阿里巴巴集团的战略项目，通过与各地 zf 深度合作，以电子商务平台为基础，搭建县村两级服务网络，充分发挥电子商务优势，突破物流、信息流的瓶颈，人才和意识的短板，实现“网货下乡”和“农产品进城”的双向流通功能。加速城乡一体化，吸引更多的人才回流创业，为实现现代化、智能化的“智慧农村”而积基树本。 -->

 <!-- 主要是用使用「 weex 」开发无线业务以及「 react 」「 node 」 开发 PC 业务
aparadeway -->
weex是不是只有阿里在用？
Weex官网的解释是 Weex 是一个动态化的高扩展跨平台解决方案。就我的理解就是为了达到写一份代码可以同时在移动端（Android端、iOS端），Web端 同时运行的目的而开发的一系列系统或者提出了解决方案。这个系统方案包含各种native sdk、weex项目、构建工具、调试工具、文档等等。


----------
## this
this的执行代码 （考核了 闭包、作用域 以及 自执行）
```js
var number = 5;             // 1
var obj = {
    number: 3,              // 2
    fn1: (function () {
        var number;         // 3
        this.number *= 2;       // 4
        number = number * 2;
        number = 3;
        return function () {
            var num = this.number;      // 5
            this.number *= 2;           // 6
            console.log(num);
            number *= 3;                // 7
            console.log(number);
        }
    })()
}
var fn1 = obj.fn1;
fn1.call(null);
obj.fn1();
console.log(window.number);
```
```js
这里一共有7处容易混淆的点，先标号
首先在定义完obj的fn1函数之后，其实就已经执行了对应的自执行函数，这个函数返回另一个函数并赋值给obj.fn1
这个自执行函数在 4 处 拿到的是最外层也就是```window.number```的值并进行修改
3 处的变量使得fn1函数实现一个闭包
实际上，obj.fn1函数定义完之后就是
// obj.fn1
同时这个函数可以访问闭包变量 number ，这个值为 3
function () {
    var num = this.number;      
    // 这里的this，当this指向全局时，是全局定义的那个 this.number 为 10（注意，这个值在 自执行函数 中已经被修改）；‘如果指向obj 则this.number为3 
    this.number *= 2;          
    console.log(num);
    number *= 3;              
    console.log(number);
}
```
```js
// 执行函数
var fn1 = obj.fn1;
fn1.call(null);         // 10 6
// 此时函数中 this 指向 全局，故 输出 10;number 作为闭包变量被修改，赋值为 6
obj.fn1();              // 3 27
// 此时函数中的this 指向 obj，故输出 3 ，注意，我们前一行代码调用的时候已经修改了闭包中变量的值，所以 9 * 3 == 27
console.log(window.number); // 20
// 这里是由于第一次函数调用的时候 执行了一次乘2，也就是标号为 6 处
```