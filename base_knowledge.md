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

通过下面的方法来创建包含undefined单元（而非“空单元”）的数组，
```js
var a = Array.apply(null,{length: 3});
a; // [undefined,undefined,undefined]
```

##### 同理，除非万不得已，否则尽量不要使用Object()/Function()/RegExp()
强烈建议使用常量形式（如/^a*b+/g）来定义正则表达式，这样不仅语法简单，执行效率也更高，因为**JavaScript引擎在代码执行前会对他们进行预编译和缓存**。与前面的构造函数不一样，RegExp()有时还是挺好用的。

##### Date()和Error()
获取当前时间的时间戳
```js
Date.now
// 如果调用Date()时不带new关键字，则会得到当前日期的字符串值。其具体格式规范没有规定。
```
创建错误对象主要是为了获得当前运行栈的上下文（大部分JavaScript引擎通过只读属性.stack来访问）。栈上下文信息包括函数调用栈信息和产生错误的代码行号，以便于调试。

##### Symbol()✨
该类型的引入主要是源于ES6的一些特殊构造，此外符号也可以自行定义。

符号可以用作属性名，但无论在代码还是开发控制台中都无法查看和访问它的值，只会显示诸如Symbol(Symbol.create)这样的值

ES6中有一些预定义的符号，以Symbol的静态属性形式出现，诸如Symbol.create,Symbol.iterator等。

Symbol不能带关键词来使用。

**符号并非标量，只是一种简单标量基本类型**

##### 原生原型
原生构造函数有自己的.prototype对象，如Array.prototype。

例如，将字符串封装为字符串对象之后，就可以访问String.prototype的方法了

文档规定 String.prototype.yxz可以写为String.prototype#yxz

```js
typeof Function.prototype // "function"
Function.prototype()      // 空函数

RegExp.prototype.toString()   // "/(?:)/"
"abc".match(RegExp.prototype) // [""]
```
Function.prototype是空函数， RegExp.prototype是一个空正则表达式，而Array.prototype是一个空的数组。

## 强制类型转换
**隐式转换**称为强制类型转换
JavaScript中的强制类型转换总是返回标量基本类型值，如字符串、数字和布尔值，不会返回对象和函数。

类型转换发生在静态类型语言的**编译阶段**，而强制类型转换则发生在动态类型语言的运行时（runtime）。然而在JavaScript中通常将它们统称为强制类型转换。倾向与用“隐式类型转换”和”显式类型转换“。（容易区分）

副作用都是相对而言的。

#### ToString
>基本类型的字符串转换规则：
* null=>"null"
* undefined=>"undefined"
* true=>"true"
* 数字的字符串化则遵循通用规则

对于普通对象，除非自行定义，否则toString()返回内部属性[[class]]的值，如“[object,object]”,如果对象有自己的toString()方法，字符串化的时候就会调用该方法使用其返回值。

数组默认的toString方法经过了重新定义，将所有单元字符串化以后再用“，”连接起来：
```js
var a = [1,2,3];
a.toString(); // "1,2,3"  
// 数组的这个方法貌似有延伸空间。
```
##### JSON字符串化
工具函数JSON.stringify()将JSON对象序列化为字符串的时也用到了ToString()

注意✨，JSON字符串化并非严格意义上的强制类型转换，只不过序列化的结果总是字符串
```js
JSON.stringify("42"); // ""42""
```
所有安全的JSON值（JSON-safe）都可以使用KSON.stringify()字符串化，安全的JSON值是指能够呈现为有效JSON格式的值。

不安全的JSON值：undefined、function、Symbol和包含循环引用（对象之间循环引用，形成一个无限循环）

JSON.stringify()在对象中遇到undefined、function和Symbol时会自动将其忽略。在数组中会返回null，**以保证位置不变**。
```js
JSON.stringify( undefined ) // undefined
JSON.stringify( function(){} ) // undefined
JSON.stringify(
    [1,undefined,function,4]; // “[1,null.null,4]”
)
JSON.stringify(
    {a:2,b:function(){}}    // "{"a":2}"
)
```
如果对象中定义了toJSON()方法，JSON字符串化时会首先调用该方法，然后用它的返回值来进行序列化。

如果要对含有非法JSON值的对象做字符串化，或者对象中的某些值无法被序列化时，就需要定义toJSON()方法来返回一个安全的JSON值。意思就是说可以在toJSON()中进行自定义。当一个对象定义了toJSON这个方法，那么在对这个对象进行序列化的时候就可以让返回这个toJSON()方法返回值的字符串形式的值。也就是说toJSON()可以返回一个能够被字符串化的安全的JSON值。

##### 几个不太为人所知但却非常有用的功能
JSON.stringify(...)传递一个可选参数replacer,它可以是数组或者函数，用来指定对象序列化过程中哪些属性应该被处理，那些应该被排除。**和toJSON很像**。
```js
var a = {
    b:42,
    c: "42",
    d: [1,2,3]
}
JSON.stringify(a,["b","c"]);  // "{"b":42,"c":"42"}"
JSON.stringify(a,function(k,v) {
    if (k!="c") return v;
}); // 遍历属性，判断是否符合再返回，注意，它会对对象本身调用一次。
// k是索引值
// 你会发现 JSON.stringify 也 会遍历数组的 
```
JSON.stringify还有一个可选参数space，用来指定输出的缩进格式。space为整数时是指定每一级缩进的字符数，它还可以是一个字符串，这样最前面的是个字符被用于每一级的缩进：
```js
var a = {
    b:42,
    c: "42",
    d: [1,2,3]
}
JSON.stringify(a,null,"------");
// "{
// ------"b": 42,
// ------"c": "42",
// ------"d": [
// ------------1,
// ------------2,
// ------------3
// ------]
// }"
```
#### ToNumber
基本类型的转换
* true => 1
* false => 0
* undefined => NaN
* null => 0

ToNumber在转换失败的时候返回NaN。不同的是ToNumber对八进制也就是0开头的数字不按照八进制处理而是按照十进制。

**为了将值转换为相应的基本类型值，抽象操作ToPrimitive会首先检查该值是否有valueOf()方法，如果有并且返回基本类型值，就使用该值进行强制类型转换，如果没有就使用toString()的返回值（如果存在）来使用强制类型转换。**

如果valueOf()和toString()均不返回基本类型值，会产生TypeError错误 

从ES5开始，使用Object.create(null)创建的对象[[Prototype]]的属性为null，并且没有valueOf()和toString()方法，因此无法进行强制类型转换。

```js
Number([]) // 先toString()转换为“”，再Number()转化为0
```

#### ToBoolean
* 假值
    * undefined
    * null
    * false
    * +0\-0\NaN
    * ""

##### 假值对象
假值对象并非封装了假值的对象。

JavaScript代码中会出现假值对象，但它实际上并不是属于JavaScript语言的范畴

浏览器再某些特定情况下，在常规JavaScript语法基础上自己创建了一个外来值，这就是“假值对象”

假值对象看起来和普通对象并无二致（都有属性），但将它们强制类型转换为布尔值时结果为false

虽然document.all现在已经废弃了，但是以前这个api是收集类数组对象，可以用来判断是否是老版本的IE

我们无法彻底摆脱document.all，但是为了新版本更加符合规范，IE并不打算继续支持if(document.all)  此时ie做了一个决定——把document.all当作假值，这样，开发者仍然可以用该api来判断，又使得浏览器更加符合规范！！

##### 真值
真值就是除了假值列表之外的值。

譬如
```js
var a = "false";
var b = "0";
var c = "''";
var d = Boolean( a && b && c)
d; // true
```

反正只需要记住假值列表就好啦！因为真值列表实在是太长了，包括函数，数组...

#### 显式强制类型转换
##### 字符串和数字之间的显式转换
字符串和数字之间的转换是通过String()和Number()这两个内建函数来实现的。

```js
var a = 42;
var b = a.toString();

b; // "42"
```
a.toString()是显式的，不过其中涉及隐式类型转换。因为toString()对42这样的基本类型值是不适用的，所以JavaScript引擎会自动为42创建一个封装对象，然后再对该对象调用toString()

在开源社区中，一元运算符+被普遍认为是显示地将字符串转换为数字，而非数字加法运算
```js
var c = "3.14";
var d = 5+ +c;
d; // 8.14
// 同理，‘-’也是可以将字符串转化为数字
```
* 日期显式转换为数字
一元运算符+的另一个常见用途是将日期（Date）对象强制类型转换为数字，返回结果为Unix时间戳，以毫秒为单位（从1970年1月1日00:00:00UTC到当前时间）

最好使用ES5中新加入的静态方法Date.now()来将日期对象转换为时间戳并非只有强制类型转换这一种方法。为老版本浏览器提供Date.now()的ployfill也很简单：
```js
if (!Date.now) {
    Date.now = function() {
        return +new Date()
    }
}
```
##### 神奇的～运算符号
字位运算符只适用于32位整数，运算符会强制操作数使用32位格式，这是通过抽象操作ToInt32来实现的。

ToInt32首先执行ToNumber强制类型转换

～，它首先将值强制类型转换为32位数字，然后执行字位操作“非”（对每一个字位进行反转）

|运算符（字位操作“或”的空操作 0 | x ）它仅执行ToInt32转换
```js
0 | -0          // 0
0 | NaN        // 0
0 | Infinity    // 0
0 | -Infinity    // 0
// 以上这些特殊数字无法以32位格式呈现（因为它们来自64位IEEE754标准）因此ToInt32返回0
```

-1是一个“哨位值”，哨位值是那些在各个类型中被赋予了特殊含义的值，在C语言中我们用-1来表示函数执行失败，用大于等于0来表示函数执行成功。indexOf方法也遵循这一惯例
>=0 、!=-1、 <0 、==-1中>=0和==-1这样的写法并不是很好，称为**抽象渗漏**，意思是在代码中暴露了底层的实现细节。

～和indexOf在一起可以将结果强制类型转换。
```js
var a  = "Hello world";
~a.indexOf("lo");   // -4

if (~a.indexOf("lo")) { // true

}
// 如果indexOf返回-1，～将其转换为假值0，其他情况一律转换为真值。
～x => -(x+1)
```
觉得～比>=0和==-1简洁

##### 字位截除
～～通常被开发人员来截除数字值的小数部分，实际上结果和Math.floor效果不一样

～～中的第一个～执行ToInt32并反转字位，然后第二个～再进行一次字位反转，即将所有字位反转回原值。最后得到的仍然是ToInt32的结果。

～只适用于32位数字，更重要的是它对负数的处理与Math.floor不同
```js
Math.floor(-49.6) // -50
~~-49.6;          // -49
```
~~能将值截除位一个32位整数，x|0也可以，而且看起来还更简洁。

##### 显式解析数字字符串
```js
var a = "42";
var b = "42px";
Number(a); //42
parseInt(a); // NaN
Number(b); // 42
parseInt(b); // 42
// 解析允许字符串中含有非数字字符，解析按从左到右的顺序，如果遇到非数字字符就停止。而转换不允许出现数字字符，否则回失败并返回NaN
```
应该避免向parseInt()传递非字符串参数，否则会先进行隐式转换为字符串

ES5之前的parseInt()有一个坑导致了很多bug，即如果没有第二个参数来指定转换的基数（radix）则parseInt()会根据字符串的第一个字符来自行决定基数。
```js
parseInt(1/0,19);//18
// => parseInt("Infinity",19);
// 第一个字符是I，19基数时就是18，第二个字符是n，不是一个有效的数字字符，解析到此为止
```

此外还有一些看起来奇怪但实际上能解释德通的例子
```js
parseInt(0.000008);  // 0
parseInt(0.0000008); // 8   (8e-7)
parseInt(false,16);  // 250   ("fa"来自“false”)
parseInt(parseInt,16);  // 15 （“f”来自“function”）
parseInt("0x10");  // 16
parseInt("103",2);  // 2 
```
##### 显式转换为布尔值
```js
var a = "0";
var b = [];
var c = {};
var d = "";
var e = 0;
var f = null;
var g;
Boolean(a);  // true
Boolean(b);  // true
Boolean(c);  // true
Boolean(d);  // false
Boolean(e);  // false
Boolean(f);  // false
Boolean(g);  // false
```
一元运算符！显式地将值强制转换为布尔值，但是它同时还将其真值反转为假值（或反过来）
**所以显示强制类型转换为布尔值常用的方法是!!**

✨
```js
var a = 42;
var b = a ? true : false;
// 三元运算符这里面表面上用到了显式的ToBoolean强制类型转换。实际上是隐式转换。这种转换有白害无一益，应该杜绝
// 建议使用 Boolean(a) 转换或者 !!a
```
隐式类型转换的作用是减少冗余，让代码更简洁。（但也有人认为会造成代码晦涩难懂，还是要看实际情况吧）

##### 字符串和数字之间的隐式强制类型转换
```js
var a = [1,2];
var b = [3,4];
a + b; // "1,23,4"
```
如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+将进行拼接操作。如果其中一个操作数是对象（包括数组），那么首先对其调用ToPrimitive()抽象操作，该抽象操作再调用[[DefaultValue]],以数字作为上下文。

这里和ToNumber的操作不一样，因为数组的valueOf返回的不是基本类型值，所以是转而调用toString()

a + ""(隐式)和前面的String(a)（显式）之间有一个细微的差别：ToPrimitive抽象操作规则，a+""会对a调用valueOf()方法，然后通过ToString()抽象操作将返回值转换为字符串。而String(a)是直接调用ToString()

关于-号运算符：
```js
var a = [3];
var b = [1];
a - b; // 2
// 它们先被转化为字符串再转化为数字，再进行计算
```
##### 布尔值到数字的隐式强制类型转换
例子：如果参数中有且只有一个参数为true，则函数返回true
```js
function oblyOne(a,b,c) {
    return !! ((a && !b && !c) || (!a && b && !c) || (!a && !b && c))
}
var a = true;
var b = false;
oblyOne(a,b,b); // true
oblyOne(b,a,b); // true
oblyOne(a,b,a); // false
```
利用强制类型转换
```js
function oblyOne() {
    // 严格模式下arguments失真
    let args = arguments;
    let argLength = args.length;
    let sum = 0;
    for (let i = 0; i < argLength; ++i) {
        // 跳过假值，和处理0一样，但是避免了NaN
        if (args[i]) {
            sum += args[i];
        }
    }
    return sum == 1;
}
```
利用reduce
```js
function oblyOne(...args) {
    let sum = 0;
    sum = Array.prototype.reduce.call(args,(prev,next) => {
        return prev += next;
    },sum)
    return sum == 1;
}
```
##### || 和 &&
✨和其他语言不一样，JavaScript中它们的返回值是两个操作数中的一个（且仅一个），即选择两个操作数中的一个然后返回。

|| 和 && 会先对第一个操作数执行条件判断，如果其不是布尔值，就先进行ToBoolean强制类型转换，然后再执行条件判断
* 对于||来说，如果条件判断结果为true就返回第一个操作数的值，如果为false就返回第二个操作数的值
* 对于&&来说，如果条件判断结果为true就返回第二个操作数的值，如果为false就返回第一个操作数的值

&&也叫做守护运算符

##### 符号的强制类型转换
ES6允许从Symbol到字符串的显式强制类型转换，然而隐式类型转换会发生错误

符号不能够被强制类型转换为数字（显式隐式都会报错）


#### 几个特殊的类型转换函数的总结
* ToString
    * 字符串、数字、布尔值和null的JSON.stringify(...)规则与ToString基本相同
    * 如果传递给JSON.stringify(...)的对象中定义了toJSON()方法，那么该方法会在字符串化前调用，以便将对象转换为安全的JSON值。
* ToNumber
    * 检查该值是否有valueOf方法，如果有并且返回基本类型值，就使用该值进行强制类型转换。如果没有则使用toString()的返回值（如果存在）来进行强制类型转换
    * 如果valueOf()和toString()**均不返回基本类型值**，会发生TypeError错误
* ToBoolean
    * 所有假值的布尔强制类型转换结果为false：undefined、null、false、+0、-0、NaN、“”
* 显式强制类型转换
    * 字符串和数字之间的显式转换：String()、Number()
        * toString()
    * 显式转换数字字符串
        * Number() 转换不允许出现非数字字符
        * parseInt()  解析允许出现非数字字符，遇到即解析停止，返回已经解析的那部分数字
            * 解析非字符串 （有bug）
    * 显式转换为布尔值
        * Boolean()
        * !!
* 隐式强制类型转换
    * 字符串和数字之间的隐式强制类型转换
        * 如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+将进行拼接操作。如果其中一个操作数是对象（包括数组），那么首先对其调用ToPrimitive()抽象操作，该抽象操作再调用[[DefaultValue]],以数字作为上下文。因为数组的valueOf返回的不是基本类型值，所以是转而调用toString()
    * 布尔值到数字的隐式强制类型转换
    * 隐式强制类型转换为布尔值
        * if
        * for
        * while和do...while
        * ? :中的条件判断表达式
        * || 和 && 左边的操作数（作为条件判断表达式）


#### == 和 ===
正确的解释：==允许再相等比较中进行强制类型转换，而===不允许
##### 抽象相等 （按照规范）
* 字符串和数字之间的相等比较
    * 如果==两边一个是字符串一个是数字，那么将字符串转换为数字再进行比较
* 其他类型和布尔值之间的比较
    * 如果==两边有一个值是布尔值另一个不是，那么就将布尔值转化为对应的数值类型再根据已有的规则比较 （这里很容易就混淆）
* null和undefined之间的相等比较
    * 当==两边是null或者undefined时候，都返回true
    * null == undefined、undefined == null 都返回true ，其他值和null/undefined相比都是false
    * a == null 这样的代码可以提高代码的可读性
* 对象和非对象之间的比较
    * 如果其中之一是字符串或者数值，另一个是对象，那么就返回对象的ToPrimitive,再根据规则比较
    （这里没说布尔值的原因是，布尔值会转换为数值） 
    * 拆封对象对应的基本类型值和基本类型值是相等的，但是
    ```js
        var a = null;
        var b = Object(a);
        a == b; // false
        // 当基本类型值是null、undefined、NaN时，它们和它们对应装箱的对象 == 是不相等的
    ```
* 比较少见的情况
    * 返回其他数字
    ```js
        Number.prototype.valueOf = function() {
            return 3;
        }
        new Number(2) == 3; // true
    ```
    ```js
        // 如何使得下列条件表达式成立
        if (a == 2 && a == 3) {
            //...
        }
        // 实现如下
        var i = 2;
        Number.prototype.valueOf = function() {
            return i++;
        }
        var a = new Number(42);
        if (a == 2 && a == 3) {
            console.log("..")
        }
    ```
* 假值的相等比较

自己一直混淆的几种情况
```js
"0" == ""; // false
false == "";// true
false == {}; // false;
"" == []; // true;
"" == {}; // false;
```
* 极端情况
```js
[] == ![] // true
=>  由于[]对应的值是真值，那么[] == false ;
false => 0; []=>"";
判断0 == "" => true
```
嘿嘿，""==[null] // true

#### 安全运用隐式强制类型转换
需要对==两边的值认真推敲，以下两个原则可以让我们有效地避免出错。
* 如果两边的值中有true或者false，前往不要使用==
* 如果两边的值中有[] “” 或者0，尽量不要使用==

#### 抽象关系比较
```js
var a = [ 42 ];
var b = [ "43" ];
a < b; //true
b < a; // false
```
```js
var a = ["42"];
var b = ["043"];
a < b; // false
// 同理-----
var a = [4,2];
var b = [0,4,3];
a < b; // false
```
对象呢？
```js
var a = {b:42};
var b = {b:43};

a < b; // false; 这是由于双方转化为 "[object Object]"
a == b; // false   这是由于地址不一样
a > b; // false 

a <= b; // true;
a >= b; // true;
// 这是由于根据规范 a <= b 意思就是a 不大于 b，也就是说 !(a>b) 由于a>b为false，所以结果为true
```

为了安全，应该对关系比较中的值进行显式强制类型转换：
```js
var a = [ 42 ]
var b = "043"

a < b   // false  字符串比较 
Number(a) < Number(b)   // true  字符串比较
```
## 语法
开发控制台中，语句的返回值显示 undefined‘

代码块的结果值就如同一个隐式的返回，即返回最后一个语句的结果值

如果想要获取语句的返回值，可以用eval或者ES7规范中有一项“do 表达式”

++a++这样的值会报错，因为它先执行a++之后返回一个具体的数值，比如42，这个++42是错误的写法。

delete(那些不存在或者存在且可配置)属性成功时返回true。

JSON的确是JavaScript语法的一个子集，但是JSON本身并不是合法的JavaScript语法，所以直接在代码中写{"a":42}这样的语法是会报错的，并不能认为这样写可以作为标签语句，因为标签语句是没有双引号的。

JSON-P通过将数据传递给函数来实现对其访问。

#### 代码块
ps：一个坑
```js
[] + {} // []=>""   {}=>[object Object] 结果“[object Object]”
{} + [] // {}作为一个代码块(允许没有分号作为结尾) +[]强制类型转换为0 结果为 0
```

#### 对象解构
对象的解构赋值用在 传递函数参数 是非常有用的
```js
function foo({a,b,c}) {
    console.log(a,b,c)
}
// 调用
foo({
    c: [12,3],
    a: 2,
    b: 1 
})
```
#### 优先级
##### 短路
短路运算中&&常常用来保证属性访问的安全性，||常用来避免执行不必要的代码

#### 自动分号
ASI（Automatic Semicolon Insertion）

ASI实际上是一个“纠错”机制。这里的错误是指解析器错误，而不是依赖JavaScript引擎来修改错误。

#### 提前使用变量
暂时性死区

有意思的是 对未声明变量使用typeof不会产生错误，但在暂时性死区

#### 函数的参数
下面这种情况会导致错误，因为**b=a+b+5**中b的左边使用了未生命的b值
```js
var b = 3;
function foo(a=42,b=a+b+5) {
    // ..
}
```
如果参数被忽略或者值为undefined，则取该参数的默认值。

参数被省略和赋值为undefined是不一样的：
```js
function foo(a=42,b=a+1) {
    console.log(
        arguments.length,a,b,
        arguments[0],arguments[1]
    )
}
foo(); // 0 42 43 undefined  undefined
foo(10); // 1 10 11 10 undefined
foo(10,undefined); // 2 10 11 10 undefined
foo(10,null); // 2 10 null 10 null
```
向函数传递参数时，arguments数组中的对应单元会和命名参数建立关联以得到相同的值。相反，不传递参数就不会建立关联。**在严格模式中并没有建立关联这一说**
```js
function foo(a) {
    "use strict";
    a = 42;
    console.log( arguments[0] )
}
foo(2);//2(no linked)
foo(); // undefined(no linked)
```
#### try..finally
finally无论出现什么情况都会执行

如果try 中return一个值，那么这个值会被暂时先存起来，然后执行finally中的代码，如果finally中也有return一个值，那就会将try中return的值覆盖掉！！try中throw一个值也是如此

但是如果finally中抛出一异常，那么函数就会在此处终止。如果此前try中已经return设置了返回值，则该值会被丢弃
```js
function foo() {
    try {
        return 42;
    } finally {
        console.log("Hello");
    }
    console.log("never runs");
}
console.log(foo());
// Hello
// 42
```
```js
for (var i = 0; i < 10; ++i) {
    try {
        continue;
    } finally {
        console.log( i )
    }
}
// 0 1 2  3 4 5 6 7 8 9 而不是1-10
// 因为finally一定会执行！
```
#### Switch
switch与case表达式的匹配算法与 === 相同

JavaScript中有很多错误类型，分为两大类：早期错误（编译时错误，无法被捕获）和运行时错误（可以通过try...catch来捕获），所有语法错误都是早期错误，程序有语法错误则无法运行

#### 全局DOM变量
声明一个全局变量的结果不仅仅是创建一个全局变量，而且还会在global对象中创建一个同名属性。

✨由于浏览器演进的历史问题，在创建带有id属性的DOM元素的时候也会创建同名的全局对象。

#### 原生原型
不要扩展原生方法（1、可能你定义的方法/名会称为规范的API 2、API处理结果可能不一样导致结果出错）

——解决方案：加入判断条件（但不一定有效）
```js
(function() {
    if (Array.prototype.push) {
        var a = [];
        a.push(1,2);
        if (a[0] == 1 && a[1] == 2) {
            // 测试通过，可以放心使用
            return ;
        }
    }
    throw Error(
        "Array#push() is missing/broken" 
    )
})
```

#### shim/ployfill
按照大部分人赞同的方式来预先实现能和将来的标准兼容的ployfill（检查功能是否存在）

shim(兼容性测试)

#### script
两个script标签的js文件不存在全局变量作用域的提升机制

## 异步
>这一部分放在 async.md中



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