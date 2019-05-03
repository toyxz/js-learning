> 尽可能多的实现子元素垂直水平居中

基本html结构
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>test</title>
    </head>
    <body>
        <div class="parent">
            <div class="children"></div>
        </div>
    </body>
</html>
```
样式
```css
/*flex*/
.parent {
    width: 300px;
    height: 300px;
    background-color: #000000;
    display: flex;
    justify-content: center;
    align-items:center;
}
.children {
    width: 100px;
    height: 100px;
    background-color: #cccccc;
}
/*绝对定位相对定位*/
.parent {
    width: 300px;
    height: 300px;
    background-color: #000000;
    position: relative;
}
.children {
    width: 100px;
    height: 100px;
    background-color: #cccccc;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
/*float*/
.parent {
    width: 300px;
    height: 300px;
    display: table; 
    overflow: hidden;
    background-color: #000000;

}
.children {
    width: 100px;
    height: 100px;
    float:left;
    margin-left: 50%;
    margin-top: 50%;
    transform: translate(-50%,-50%);
    background-color: #cccccc;
}
```

> 实现三栏布局，要求main在中间

html
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>test</title>
    </head>
    <body>
        <div class="container">
            <div class="main">hello world</div>
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </body>
</html>
```
css
```js
/*圣杯模式*/
.container {
    overflow: hidden;
    height: 100px;
    padding: 0 100px 0 100px;
}
.main,.left,.right {
    float:left;
    position: relative;
}
.main {
    width: 100%;
    min-height: 100px;
    background-color: #ccc;
}
.right {
    width: 100px;
    min-height: 100px;
    margin-left: -100px;
    right: -100px;
    background-color: rgb(226, 143, 35);
}
.left {
    width: 100px;
    min-height: 100px;
    margin-left: -100%;
    left: -100px;
    background-color: #ee33ee;
}
/*双飞翼模式*/
.container {
    overflow: hidden;
    height: 100px;
}
.main,.left,.right {
    float:left;
    position: relative;
}
.main {
    width: 100%;

}
.main-inner {
    margin-left: 100px;
    margin-right: 100px;
    min-height: 100px;
    background-color: #ccc;
}
.right {
    width: 100px;
    min-height: 100px;
    margin-left: -100px;
    background-color: rgb(226, 143, 35);
}
.left {
    width: 100px;
    min-height: 100px;
    margin-left: -100%;
    background-color: #ee33ee;
}
```
