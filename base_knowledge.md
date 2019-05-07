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
#### 数组
使用delete可以将单元从数组中删除，但是数组的length并不会改变

实际上，直接操作length是可以操作数组的，所以可以通过一种方式来实现 delete 的同时长度及时更新
```js
let arr = [1,2,3]
arr['myLength'] = arr.length
delete arr[1]
let n = -1;
for (let item in arr) {
    if (arr[item]) {
        n++;
    }
}
arr.myLength = n
console.log(arr)
console.log(arr.myLength)
```
##### 稀疏数组
我们知道，JavaScript中数组是没有类型限制的，同时，可以在数组中给任意下标赋值
```js
let arr = []
arr[3] = 1

console.log(arr)            // [ <3 empty items>, 1 ]
console.log(arr.length)     // 4
```

如果在数组中加入字符串键值，是不会计入 length 的

#### 类数组
对于一个普通的对象来说，属性是非负整数，拥有length属性，可以进行数组的一些行为（但是很多行为还是需要通过call数组的方法来实现）

例如，通过DOM查询获得的html集合、函数中的arguments就是类数组（严格模式下不支持）


如何将类数组转化为数组
```js
let obj = {'0':'+','1':'-','2':'%',length: 3}
// 方法1:
Array.from(obj)
// 方法2:
console.log(Array.prototype.slice.call(obj))
```

#### 字符串
**字符串也是一种类数组**也可以使用indexof以及concat方法，也拥有length属性。

JavaScript中字符串是不可变的，但是数组是可变的，，并且使用字符串索引下标不一定总是合法。

字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串，而数组的成员函数都是在其原始值上进行操作的。

**很多情况下字符串可以借用数组的非变更方法来处理字符串**

字符串无法直接借用数组的reverse函数，这是由于reverse这个函数可变的成员函数，也就是会改变内部值，一个变通的方法就是先split为数组，reverse之后再join

#### 数字
JavaScript没有整数和小数之分

JavaScript中的数字类型是基于IEEE754标准来实现的，该标准通常也被称为浮点数，JavaScript使用的是“双精度”格式（64位二进制）

默认情况下大部分数字都以十进制显示，小数部分最后面的0被省略

特别大和特别小的数字默认用指数格式显示，与toExponential()函数的输出结果相同

由于数字可以使用Number对象进行封装，因此数字值可以调用Number.prototype中的方法

常用方法
* toFixed
* toPrecision

注意，对于.运算符需要基于特别注意，因为它是一个有效的数字字符，会被优先识别为数字字面量的一部分，然后才是对象属性访问运算符

42.toFixed(3)  // 该语法是错的，因为会被优先解析为42.

0x 十六  0o 八 0b 二 
从ES6开始。严格模式不再支持0363八进制格式。转为 0o 0O


#### 较小的数值
二进制浮点数最大的问题（不止止是JavaScript。所有遵循IEEE754规范的语言都是如此），也就是说会出现0.1 + 0.2 === 0.3 // false (这是由于0.1和0.2b并不精确)

**如何判断0.1 + 0.2 === 0.3**
最常见的方法是设置一个误差范围值，通常称为**机器精度**,对于JavaScript来说，这个值通常是2^-52

从ES6开始，改值定义在Number.EPSILON中，我们可以直接拿来用，也可以为ES6之前的版本写ployfill
```js
if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2.-52);
}
```

Math.MAX_VALUE 最大的浮点数
Math.MIN_VALUE 最小的浮点数（不是负数，只是无线接近于0！）

##### 整数的安全访问
数字的呈现方式决定了“整数”的安全值范围远远小于Number.MAX_VALUE。

能够被安全呈现的最大整数是2^53-1，在ES6中被定义为Number.MAX_SAFE_INTEGER，最小的整数被定义为Number.MIN_SAFE_INTEGER

有时JavaScript程序需要呈现一些比较大的数字，那么就需要转为字符串来操作。

##### 整数的检测
检测一个数是不是整数，可以用ES6中的Number.isInteger方法
```js
Number.isInteger(42.000) // true
Number.isInteger(42.3) // false
```
ES6之前的ployfill版
```js
if (!Number.isInteger) {
    Number.isInteger = function(num) {
        return typeof num == "number" && num % 1 == 0
    }
}
```
检测一个数是不是安全的整数，可以用ES6的isSafeInteger

也可以使用ES6之前的ployfil
```js
if (!Number.isSafeInteger) {
    Numebr.isSafeInteger = function(num) {
        return Number.isInteger(num) && Math.abs(num) <= Number.MAX.SAFE_INTEGER
    }
}
```

#### 32位有符号整数
虽然整数最大能够达到53位但是有些数字操作（如数位操作）只能适用于32位数字，所以这些操作中数字的安全范围就药小很多，变成从Math.pow(-2.31)到Math.pow(2.31)

a | 0 可以将变量a中的数值转换为32位有符号整数，因为数位运算符只适用于32位整数（其他位会被忽略）

#### 特殊数值
不是值的值

null是一个特殊的关键字，不可以作为标识符，而undefined可以
```js
var undefined = '1' // 没有报错，但是打印出来还是undegined，不能将其覆盖 (浏览器好像默认不能修改undefined的值，值还是undefined)
var null = '1' // 报错
```
##### void 运算符
undefined还可以通过void运算符来获得该值

表达式void _ 没有返回值，因此返回结果是undefined

惯例 用 void 0 来表示undefined

void 运算符也能在其他地方派上用场，比如不让表达式返回任何结果（即使有副作用）

### 特殊的数字
不是数字的数字：
如果数学运算的操作数不是数字类型就无法返回一个有效的数字，这种情况返回值为NaN。

NaN指的是“不是一个数字”（not a number）

NaN是一个特殊值，它和自身不相等，是唯一一个非自反。

#### 如何判断非自反
可以用全局的isNaN来判断，但是有个历时20年的bug没有解决：
```js
var a = 2 / "foo"
var b = "foo"
window.isNaN(a) // true
window.isNaN(b) // true
```
✨从ES6开始我们就可以使用工具函数Number.isNaN来，ES6之前的浏览器的ployfill如下：
```js
if (!Number.isNaN) {
    Number.isNaN = function(n) {
        return (
            typeof n === "number" && window.isNaN(n)
        )
    }
}
```
还可以利用NaN不等于自身的特点写一个ployfill
```js
if (!Number.isNaN) {
    Number.isNaN = function(n) {
        return n != n
    }
}
```
##### 无穷数
```js
1/0 // Infinity
1/-0 // -Infinity
```
规范规定，如果数学运算（如加法）的结果超出处理范围，则由IEEE754规范中的“就近取整”模式来决定最后的结果。例如
```js
var a = Number.MAX_VALUE; // 1.7976931348623157e+308
a + a; // Infinity
a + Math.pow(2,970);   // Infinity
a + Math.pow(2,969);    // 1.7976931348623157e+308
```
##### 零值
```js
var a = 0 / -3;
a; // -0
a.toString(); // "0"
a + "" ;    //  "0"
String(a);  //  "0"
```
反过来将其从字符串转换为数字，得到的结果是准确的：
```js
+"-0";              // -0
Number("-0");       // -0
JSON.parser("0");    // -0
```

如何区分-0与0:
```js
function isNegNero(n) {
    n = Number(n);
    return (n === 0) && (1/n === -Infinity);
}
isNegNero(-0)   // true
isNegNero(0)    // false
```

为什么要有-0？
>有些应用程序中的数据需要以级数形式来表示（比如动画帧的移动速度），数字的符号位（sign）用来代表其他信息（比如移动的方向）。如果此时一个值为0的变量失去了它的符号，它的方向信息就会丢失。所以0的符号位可以防止此类情况发生。

#### 特殊等式
ES6中新加入了一个工具方法Object.is()来判断两个值是否绝对相等，可以用来处理上面的全部情况。
```js
Object.is(2/"foo",NaN); // true
Object.is(-0,-0); // true
Object.is(0,-0); // false
```
ES6之前的ployfill：
```js
if (!Object.is) {
    Object.is = function(v1,v2) {
        // 判断是否为-0
        if (v1 === 0 && v2 === 0) {
            return 1/v1 === 1/v2;
        }
        // 判断是否是NaN
        if (v1 !== v1) {
            return v2 !== v2;
        }
        // 其他情况
        return v1 === v2;
    }
}
// 但是Object.is效率没有==、===高
```
#### 值和引用
函数的参数会指向同一个地址，所以对参数直接赋值是不会改变原来的引用类型的。
```js
function foo(x) {
    x.push(4);
    x; // [1,2,3];
    x = [4,5,6];
}
foo(a);
a;// [1,2,3] 不是[4,5,6]
```
如果想要该变原值的话可以x.length=0再进行操作。

```如果想要标量基本类型值传到函数内并进行更改，就需要将该值封装到一个复合值（对象、数组等）中，然后通过引用复制的方式传递```
```js
// 下面这种情况和预期不同
function foo(x) {
    x = x + 1;
    x;  // 3
}
var a = 2;
var b = new Number(a); // Object(a)也一样

foo(b);
console.log(b); // 是2，不是3
```
原因是标量基本类型值是不可更改的（字符串和布尔更是如此）。如果一个数字对象的标量基本类型是2，那么该值就不能更改，除非创建一个包含新建的数字对象。

x = x + 1中，x中的标量基本类型值2从数字对象中拆分（或者提取）出来后，x就神不知鬼不觉的从引用变成了数字对象，它的值从2+1变成3，然而函数外的b仍然只想原来那个值为2的数字对象。

### 原生函数（内建函数）
常用
* String()
* Number()
* Boolean()
* Array()
* Object()
* Function()
* RegExp()
* Date()
* Error()
* Symbol()
#### 内部属性 [[Class]]
这个属性一般无法访问，一般通过Object.prototype.toString()来查看

#### 封装对象包装
由于基本类型值没有.length和.toString()这样的属性和方法，需要通过封装对象才能访问，此时JavaScript会```自动```为基本类型值包装（box或者wrap）一个封装函数。

如果需要经常用到这些字符串属性和方法，比如在for循环中使用i < a.length。那么一开始就创建一个封装对象也许更为方便，这样JavaScript就不用每次都自动创建了。

但实际证明这并不是一个好办法，因为浏览器已经为.length这样的常见情况做了性能优化，直接使用封装对象来“提前优化”代码反而会降低执行效率。

一般情况下，我们不需要直接使用封装对象，最好的办法是让JavaScript引擎决定什么时候应该使用封装对象。换句话说应该优先考虑使用“abc”和42这样的基本类型值。

**关于封装对象**
```js
var a = new Boolean(false)
if (!a) {
    console.log('oops')
}
// 因为对象是 truthy
```
#### 拆封对象
如果想要得到封装对象的基本类型值，可以使用valueOf()函数
##### Array对象
```js
Array(1)  // =>[] 且 length是1
```
Array构造函数只带一个数字参数的时候，该参数会被作为数组的预设长度(length),而非充当数组中的一个元素

我们将包含至少一个空单元的数组称为“稀疏数组”。

只要将数组的length属性设置为超过实际单元数的值，就能隐式地创造处空单元，另外还可以通过delete在数组中创建一个空单元。

从ES5规范开始就允许在列表（数组值、属性列表等）末尾多加一个逗号（实际处理中会被忽略不计）。这样做可能看似令人费解，但是实际上是为了让那个复制粘贴结果更加准确。






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






------------
参考 《你不知道的JS》 以及 整理了突然想到的知识点和扩展