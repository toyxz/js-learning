#### Question
有一个长度未知的数组a，如果它的长度为0就把数字1添加到数组里面，否则按照先进先出的队列规则让第一个元素出队
```arr.length == 0 ? arr.push(1) : arr.shift()```



请把<ul><li>第1行</li><li>第2行</li>...</ul>（ul之间有10个li元素）插入body里面，注意：需要考虑到性能问题。
```js
    let strDom = ''
    let ul = document.createElement('ul')
    for (let i = 0; i < 10; ++i) {
        str += `<li>第${i}行</li>`
    }
    ul.innerHtml = lis;
    document.body.appendChild(ul)
```

不使用loop循环，创建一个长度为100的数组，并且每个元素的值等于它的下标
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