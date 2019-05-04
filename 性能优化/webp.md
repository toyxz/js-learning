### WebP

WebP主要目的是使图片质量在和jpeg格式质量相同的情况下，减少图片文件的体积，借此减少互联网上图片的发送事件和流量消耗。

WebP提供有损压缩和无损压缩

WebP 无损压缩图片比 PNG 图片少了 45％ 的文件体积

随着浏览器对webp支持的普及，越来越多的互联网开始使用webp，使得带宽下降到一定你里，页面加少时间减少显著。

进一步了解[WebP的技术实现](https://www.cnblogs.com/upyun/p/7813319.html)


#### 淘宝对WebP的应用
淘宝网图片运用了webp。假如你是safari浏览器，看到图片就是jpg或者png了，淘宝网自动判断浏览器支持不支持webp。

##### 如何检测平台是否支持webp格式
```js
// 1
function checkWebp() {
    try{
        return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
    }catch(err) {
        return  false;
    }
}
console.log(checkWebp());   // true or false
// 2
// 如果浏览器支持webp，那么图片的宽高会大于0，从而返回true,否则返回false.
// ...
var img = new Image();
img.onload = function () {
    var result = (img.width > 0) && (img.height > 0);
    callback(feature, result);
};
img.onerror = function () {
    callback(feature, false);
};
// 3
var isSupportWebp = !![].map && document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0;

// 4（另一方案）查看请求字段和响应字段
请求字段有 image/webp 说明该浏览器支持 WebP 格式图片

```
### webp兼容要和后端配合
当检测到浏览器支持webp格式时向服务器请求webp格式的图片，否则加载其他格式的图片（通过定义请求头）

### CDN是如何实现WebP自适应的
```
客户端请求资源--判断客户端是否支持WebP --否--返回原图
                    |
                    是
                    |
                CDN是否有WebP副本--是--返回WebP格式副本
                    |
                    否
                    |
                实时生成WebP副本并返回，并在CDN节点进行缓存
```

#### 如何实现相同 URL 访问，缓存不同副本图片？
利用到缓存里面的 Vary 机制了，同一个 URL 根据不同 Header 头的值缓存多份不同的拷贝，同时保持 URL 不变。例如：

请求头字段 Accept: image/webp -> 响应头需要满足 Vary: Accept 以及 Content-Type: image/webp;
 请求头字段 Accept-Encoding: gzip -> 响应头需要满足 Vary: Accept-Encoding 以及 Content-Encoding: 
### 参考文章
https://www.cnblogs.com/upyun/p/7802631.html

https://www.haorooms.com/post/webp_bigpipe

[如何通过 WebP 自适应方案减少图片资源大小](https://www.cnblogs.com/upyun/p/6844690.html)