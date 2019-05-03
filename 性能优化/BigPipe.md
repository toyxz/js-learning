今天在学习的过程中，了解到Bigpipe技术，虽然以前有听过，也知道FaceBook也使用了该项技术，但是始终没有深入理解。


## BigPipe
BigPipe的思想是把网页分解成叫做Pagelets的小块，然后通过Web服务器和浏览器监理管道管理他们在不同阶段的运行。是一种网页的性能优化方案。FaceBook支持全球用户，网页性能优化工作十分重要，而其中，BigPipe是重要一环。

#### 工作原理
* 客户端发送请求
* 服务端收到请求后，发回一个未关闭的```HTML文件```，其中包括有页面的逻辑结构和```Pagelets的占位符```。
* Bigpipe首先加载它的css资源（多个Pagelets的CSS可在同一时间下载）
* 在CSS资源被下载完成后，BigPipe将在Pagelet的标记HTML显示它的innerHTML。
* 在BigPipe中，JavaScript资源的优先级低于CSS和页面内容。因此，BigPipe不会在所有Pagelets显示出来之前下载任何Pagelet中的JavaScript。
* 最后再下载JavaScript

我简单理解为给页面分成每个小块后，异步加载资源并填充小块内容（并行方式实现），尽量减少用户对页面延时的感知。

#### 一段简单的代码
(参考[Bigpipe](https://www.haorooms.com/post/webp_bigpipe))
```html
<!DOCTYPE html>
<html>
<head>
  <script>
    var BigPipe = {
      view: function(selector,temp) {
        document.querySelector(selector).innerHTML= temp;
      }
    }
  </script>
</head>
<body>
    <div id="moduleA"></div>
    <div id="moduleB"></div>
    <div id="moduleC"></div>
```
```js
var express = require('express');
var app = express();
var fs = require('fs');

app.get('/', function (req, res) {
  var layoutHtml = fs.readFileSync(__dirname + "/layout.html").toString();
  res.write(layoutHtml);

  // setTimeout只是模拟异步返回
  var promise1 = new Promise((resolve,reject) => {
    setTimeout(function() {
        res.write('<script>BigPipe.view("#moduleA","moduleA");</script>');
        // resolve();
    100);
  })

  var promise2 = new Promise((resolve,reject) => {
    setTimeout(function() {
        res.write('<script>BigPipe.view("#moduleC","moduleC");</script>');
        // resolve();
    },200);
  })
  var promise3 = new Promise((resolve,reject) => {
    setTimeout(function() {
        res.write('<script>BigPipe.view("#moduleB","moduleB");</script>');
        res.write('</body></html>');
        // resolve();
    },200);
  })
    Promise.all([promise1,promise2,promise3])
        .then(...args) {
            // 即使没有调用resolve还是会执行then，只不过参数是undefined而已，遮掩就能关闭该http请求了
            res.end();
        }

});
app.listen(3000);
```

## 淘宝团队关于Bigpipe的实践
>http://taobaofed.org/blog/2015/12/17/seller-bigpipe/
http://taobaofed.org/blog/2016/03/25/seller-bigpipe-coding/

看完之后淘宝团队关于Bigpipe的文章之后做个学习总结。

### 页面加载方式
* 直接同步加载

服务端渲染，一次加载到客户端

一般场景：页面首屏内容基本就是页面所有内容  （例如官网）

* 滚动同步加载（lazyload）

服务端渲染首屏内容，次屏内容放在textarea 或者注释中，现将内容加载到客户端，滚动时再渲染次屏内通

一般场景：页面内容长度高出首屏内容较多

（淘宝的文章在2015年，最近看到的一个实践的文章也是采用这种方案，这么说这种方案还是可以长期使用的吧，毕竟将渲染的内容以文本的形式放在textarea里面，明显可以加快渲染）

* 异步加载
服务端渲染主layout，加载到客户端，通过AJAX获取其他页面内容，然后在客户端，滚动时再渲染次屏内容

一般场景：淘宝无线 H5 的方案类似，通过接口获取数据然后在客户端渲染

* 滚动异步加载 
（懒加载）

服务端渲染首屏内容，加载到客户端，滚动时再通过 AJAX 获取次屏内容

* 分块加载（Bigpipe）
服务端支持 chunk 输出，分块将内容传输到客户端，客户端渲染

一般场景：适合首屏输出

首屏优化方案还有```骨架屏```（待了解）

#### 分块加载（Bigpipe）下的方案实现
(A,B是首屏模块)
* 客户端请求页面
* 服务端获取主 layout 数据
* 完成 layout 拼装模板后 Flush 到客户端 Display
* 输出的 layout 必须含有 doProgess 方法
* 并行执行服务端 A 模块获取数据 A 模块模板拼装
* 并行执行服务端 B 模块获取数据 B 模块模板拼装
* A 模块先完成模板拼装，将 doProgess(‘#A’,’A template’) Script Flush 到客户端
执行方法 doProgess 实现 A 模板的渲染
* B 模块先完成模板拼装，将 doProgess(‘#B’,’B template’) Script Flush 到客户端
* 执行方法 doProgess 实现 B 模板的渲染
* ```完成并发执行后，Flush 页面结构的闭合标签```
* 客户端滚动到 C 模块位置
* 客户端发送请求 C 模块的请求
* 服务端获取 C 模块数据
* 服务端 C 模块模板拼装

并行执行，我大Nodejs就要闪亮登场了（十分容易操作！！）
```js
var http = require('http');
var fs = require('fs');

http.createServer(function(request, response) {
  response.writeHead(200, { 'Content-Type': 'text/html' });

  // flush layout and assets
  var layoutHtml = fs.readFileSync(__dirname + "/layout.html").toString();
  response.write(layoutHtml);
  
  // fetch data and render
  response.write('<script>renderFlushCon("#A","moduleA");</script>');
  response.write('<script>renderFlushCon("#C","moduleC");</script>');
  response.write('<script>renderFlushCon("#B","moduleB");</script>');
  
  // close body and html tags
  response.write('</body></html>');
  // finish the response
  response.end();
}).listen(8080, "127.0.0.1");
```

#### BigPipe的应用场景
✨
* 类似模块多，页面长，首屏又是用户核心内容。
* 每个模块的功能相对独立，模板和数据都相对独立。
* 非首屏模块还是建议用滚动加载，减少首屏传输量。
* 主框架输出 assets 和 bigpipe 需要的脚本，主要的是需要为模块预先占位。
* 首屏模块是可以固定或者通过计算确认。
* 模块除了分块输出，最好也支持```异步加载渲染```的方式。
