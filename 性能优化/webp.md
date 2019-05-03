### WebP

WebP主要目的是使图片质量在和jpeg格式质量相同的情况下，减少图片文件的体积，借此减少互联网上图片的发送事件和流量消耗。

WebP提供有损压缩和无损压缩

WebP 无损压缩图片比 PNG 图片少了 45％ 的文件体积

随着浏览器对webp支持的普及，越来越多的互联网开始使用webp，使得带宽下降到一定你里，页面加少时间减少显著。

进一步了解[WebP的技术实现](https://www.cnblogs.com/upyun/p/7813319.html)


#### 淘宝对WebP的应用
淘宝网图片运用了webp。假如你是safari浏览器，看到图片就是jpg或者png了，淘宝网自动判断浏览器支持不支持webp。

##### 如何检测平台是否支持webp格式
(来自网络资源，非自己找到的方案)
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

```
### webp兼容要和后端配合
当检测到浏览器支持webp格式时向服务器请求webp格式的图片，否则加载其他格式的图片（通过定义请求头）





### 参考文章
https://www.cnblogs.com/upyun/p/7802631.html

https://www.haorooms.com/post/webp_bigpipe