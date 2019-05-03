#### 移动web开发和传统PC开发
* 跑在手机端的web页面（H5页面）
* 跨平台
* 基于webview
* 告别```IE```拥抱```webkit```
* 更高的```适配```和```性能```要求

bybrid是基于```webview```来开发



#### 移动开发硬知识
什么是移动web？
* iOS，Android
* 2G，3G，4G
* html5
* viewpoint
* hybird

##### 移动web开发概述：
* 跑在手机端的web页面（H5页面）
* 跨平台
* 基于webview
* 告别IE拥抱webkit
   * 那么只需要兼容webkit即可
* 更高的```适配```和```性能```要求
   * 手机端的尺寸特别多
   * 手机端的内存输于浏览器
   * 网络状况，pc端的网络状况比2G，3G，4G要好很多

### 移动web调试篇
* Chrome Detools调试
* 真机调试方法

### 移动web适配篇
适配方法：

pc:
* 960px / 1000px 居中
* 盒子模型，表格，定高，定宽
* display：inline-block

移动端web
* 定高，宽度百分比
* flex 流式布局
* Media Query （媒体查询）

适配：
* Viewport和流式布局
* css flex 和media query媒体查询适配
* rem原理和适配方法
* 移动端其他适配问题

#### Viewport 视窗
* 什么是css像素，物理像素
* 手机打开pc页面刚好被等比例缩放
* 设备宽高和viewport有什么关系
* 如何使用meta设置viewport

```
物理像素和css像素
devicePixelPatio（像素比）——————》 css像素/物理像素
放大或缩小网页，会改变像素比：放大页面时，css像素会变大，这样能够承载的物理像素就会增多，这样就能看到更高清；而缩小页面的时候，css像素缩小这样就会导致物理像素呈现不出来而模糊
```

```js
移动设备的视窗概念
* layout viewport（布局视窗） ——浏览器的初始视窗和浏览器厂商有关
* visual viewport（物理视窗） ——可视区域
* ideal viewport（理想视窗）
```

```html
为什么收集打开PC页面刚好被等比例缩放？
浏览器特性：将页面内容刚好缩放至viewport的可视区域内

但是这种特性并不是很好，因为比如字体都会被缩小

设置 ideal viewport ，使得物理视窗和可视区域一样大小 
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
```

```js
流式布局
display:-webkit-flex
display:flex;
flex-direction
flex-wrap
flex-content
align-items
order
flex
align-self

```
```
媒体查询
@media 媒体类型 and （媒体特性）{
        /*css样式*/ 
}
媒体类型：screen，print...
媒体特性：max-width,max-height
```

```
rem
字体单位：值根据html跟元素大小而定，同样可以作为宽度，高度等单位。
适配原理：将px替换成rem，动态修改html的font-size适配
兼容性：IOS 6以上和android2.1以上，基本覆盖所有流行的手机系统

rem可以看木刻的另一个视屏
```

```
vw,vh,vmin,vmax
vw:1vw等于视口宽度的1%
vh:1vw等于视口高度的1%
vmin：选取vw和vh中最小的那个
vmax：选取vw和vh中最大的那个

兼容性不是很好。比较新。。。
```

```
移动端touch事件
touchstart
touchmove
touchend
touchcancel // 当某种touch事件非正常结束后触发

touches:1     
targetTouches：1
changedTouched：1

如果有三只手指且只绑定了一个div那么
touches:1 2 3      
targetTouches：1 3   // 这个常用
changedTouched：2 3  // 存储touch对象的数组      
```

```
苹果的用户体验
300ms点击延迟——双击缩放
如果300ms内没有再点击一次，那么就是单击否则就是双击

如何避免300ms延迟？
1、<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
在safati不管用


2、Tap组件（FastClick，react-app）
内部实现都是利用touchStart和touchEnd事件，由于touchstart没有延迟。所以在touchstart的时候判断有没有下一次操作。在最新版的ios webkit上也移除了300ms的延迟效果
```

```
点击穿透
--------------
click        |
    --———————|
    | touch  |
    |--------|
--------------

常用常见。点击绑定了touch事件的那个div之后，隐藏遮罩层，在300ms延迟之内，事件触发到click这一层，这个时候，浏览器就会认为我点击了浮层，并触发响应的事件   。

也就是说产生点击穿透的两个条件  （300ms的延迟）
1、touch--click
2、touch事件的target消失，触发底部click

避免 点击穿透
最好的办法：不要混用touch和click事件
```

-------上面内容等待进一步补充



### 移动web开发软技能
#### 代码管理工具
* 代码管理工具： git svn
* 代码规范工具： jshint eslint

#### 项目构建基础
* 构建工具
   * 预处理
   * 资源压缩与替换
   * 代码与测试
   * 文件监听与更新

* 构建工具：
 Grunt、Gulp

 * 模块化工具：webpack browserify



