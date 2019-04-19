#### 睡眠排序
```js
const data = [1,4,5,6,1,8,2]
 
for (let a of data) {
    setTimeout(() => {
        console.log(a)
    },a)
}
// forEach 也OK
```