#### 如何判断一个空对象
* Object.keys(obj).length === 0
* Object.getOwnPropertyNames(msg.d).length ===0
    * Object.getPropertyNames()返回除原型属性以外的所有属性

#### plainObject && EmptyObject
* plainObject ： 就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。
    * 之所以要判断是不是 plainObject，是为了跟其他的 JavaScript对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回object。
* EmptyObject
    * 没有属性的对象

#### {} 与 null 的区别
null没有在堆中分配空间，所以直接对null进行属性赋值肯定会报错