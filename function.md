#### Question
>有一个长度未知的数组a，如果它的长度为0就把数字1添加到数组里面，否则按照先进先出的队列规则让第一个元素出队

```arr.length == 0 ? arr.push(1) : arr.shift()```



>请把<ul><li>第1行</li><li>第2行</li>...</ul>（ul之间有10个li元素）插入body里面，注意：需要考虑到性能问题。
```js
    let strDom = ''
    let ul = document.createElement('ul')
    for (let i = 0; i < 10; ++i) {
        str += `<li>第${i}行</li>`
    }
    ul.innerHtml = lis;
    document.body.appendChild(ul)
```

>不使用loop循环，创建一个长度为100的数组，并且每个元素的值等于它的下标
```js
    let arr = []
    let num = 0
    function getArr() {
        if (num == 100) {
            return
        } else {
            arr.push(num)
            num++
            getArr()
        }
    }
    console.log(getArr())
```

>数组去重复
（需要考虑能否能更换原来数组的位置）
```js
// 方法一
let arr = [1,1,2,3,3,4]
arr = new Set(arr)
arr = [...arr]
console.log(arr)
// 方法二
let arr = [1,1,2,2,3,3,4,4,4,5,5,5]
let temp = []
arr.forEach((item,index) => {
    if (temp.indexOf(item) == -1) {
        temp.push(item)
    }
})
console.log(temp)
// 方法三
// 也可以用对象属性的方法，判断属性是否存在，不存在则创建对应属性和值
// 方法四
let arr = [1, 2, 3, 1, 1, 2, 3, 3, 4, 3, 4, 5]
let res = arr.reduce((prev, cur)=>{
  !prev.includes(cur) && prev.push(cur)
  return prev
}, [])

console.log(res) // [ 1, 2, 3, 4, 5 ]
```
>数组拷贝
```js
// 方法一
let arr = [1,2,3]
let temp = [...arr]
temp.pop()
console.log(arr)
// 方法二
let arr = [1,2,3]
let temp = Array.from(arr)
temp.pop()
console.log(arr)
// 方法三
let arr = [1,2,3]
let temp = []
arr.forEach(item => {
    temp.push(item)
})
console.log(temp)
```
>数组连接
```js
// 方法一       concat
let arr =  [].concat([1,2,3]).concat([4,5,6])
console.log(arr)  // [1,2,3,4,5,6]
// 方法二       扩展运算符
let arr =  [...[1,2,3],...[4,5,6]]
console.log(arr)
```
> 数组拍平
```js
// 方法一
// 可以用 ES10 的 flat()，根据传入的参数决定拍平的层数
var arr1 = [1, 2, [3, 4]];
arr1.flat(); 
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity 作为深度，展开任意深度的嵌套数组
arr3.flat(Infinity); 
// [1, 2, 3, 4, 5, 6]

// 方法二
// reduce + 递归
let arr = [1, 2, [4, 5, [6], [7, 8, [9, 10, 11]]]];
function flatten(arr) {
  if(Array.isArray(arr)) {
    return arr.reduce((prev, next) => {
       // 如果遍历的当前项是数组，再迭代展平
      return Array.isArray(next) ? prev.concat(flatten(next)) : prev.concat(next)
    }, [])
  } else {
    throw new Error(arr + ' is not array')
  }
}
console.log(flatten(arr));
```


>箭头函数与普通函数（function）的区别是什么？构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗？为什么？