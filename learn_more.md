## React Vue Angular
* Angular使用双向数据绑定，React用于单数据流，Vue支持两者
* Vue非常适合小型团队和小型项目。如果您的应用程序似乎很大并且具有重要的未来扩展计划，请选择React或Angular。






## CSS框架
* anti-design
    * 有移动端和pc端
* element ui
* veritify
* zan ui (有赞)


```手机Web、ReactNative、微信小程序, 支付宝小程序, 快应用等,每一端都是巨大的流量入口，```当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

### 小程序
#### 小程序框架
* WEPY https://tencent.github.io/wepy/document.html
    * 腾讯团队开源的一款```类vue语法规范```的小程序框架,借鉴了Vue的语法风格和功能特性,支持了Vue的诸多特征，比如父子组件、组件之间的通信、computed属性计算、wathcer监听器、props传值、slot槽分发，还有很多高级的特征支持：Mixin混合、拦截器等;WePY发布的第一个版本是2016年12月份，也就是小程序刚刚推出的时候，到目前为止，WePY已经发布了52个版本, 最新版本为1.7.2; 

* MpVue http://mpvue.com/mpvue/#-html
    * 美团团队开源的一款使用 ```Vue.js ```开发微信小程序的前端框架。使用此框架，开发者将得到完整的 Vue.js 开发体验，同时为 H5 和小程序提供了代码复用的能力。mpvue在发布后的几天间获得2.7k的star,上升速度飞起,截至目前为止已经有13.7k的star;

* Taro https://taro.aotu.io/
    * 京东凹凸实验室开源的一款使用 ```React.js ```开发微信小程序的前端框架。它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时支持使用 JSX 语法，让代码具有更丰富的表现力，使用 Taro 进行开发可以获得和 React 一致的开发体验。,同时因为使用了react的原因所以除了能编译h5, 小程序外还可以编译为ReactNative;
    * Taro 虽然是以多端为设计目标，但重心是小程序端





## Node 
Express和koa都是服务端的开发框架，服务端开发的重点是对HTTP Request和HTTP Response两个对象的封装和处理，应用的生命周期维护以及视图的处理等。
* express
    * Express主要基于Connect中间件框架，功能丰富，随取随用，并且框架自身封装了大量便利的功能，比如路由、视图处理等等
* koa
    * koa主要基于co中间件框架，框架自身并没集成太多功能，大部分功能需要用户自行require中间件去解决，但是由于其基于ES6 generator特性的中间件机制，解决了长期诟病的“callback hell”和麻烦的错误处理的问题，大受开发者欢迎
* 对应的模版引擎
    * jade && ejs

## SSR
* 简单理解是将组件或页面通过服务器生成html字符串，再发送到浏览器，最后将静态标记"混合"为客户端上完全交互的应用程序
* 当请求user页面时，返回的body里已经有了首屏的html结构，之后结合css显示出来
* 优势
    * 更利于SEO
    * 更利于首屏渲染
* 局限
    * 服务端压力较大
    * 开发条件受限
        * 在服务端渲染中，只会执行到componentDidMount之前的生命周期钩子，因此项目引用的第三方的库也不可用其它生命周期钩子，这对引用库的选择产生了很大的限制；
    * 学习成本相对较高
* SSR常用框架
    * React 的 Next
    * Vue.js 的 Nuxt

## Electron
基于Node和Chronium的桌面应用


## 可视化
* WebGL
* 库
    * three.js
    * D3.js 
* 插件
    * echart (百度)

## 社区
* 掘金
* 大型团队博客
* 360前端 奇舞团
* 美团
* 大转转
* ali 
* tx

## 移动端
* React Native
    * React-Native是：Facebook 在2015年初React.js技术研讨大会上公布的一个开源项目。支持用开源的JavaScript库React.js来开发iOS和Android原生App
* weex
    * Weex 是一款轻量级的移动端跨平台动态性技术解决方案，基于vue，可以叫做vue-native
* flutter
    * Flutter是一个全新的（其实Flutter很早就有了，前身叫Sky）移动UI框架，用来帮助开发者在iOS和Android平台上开发高质量的原生应用。



最新发生的
繁星计划、
大型流量的项目，PV级别的项目、


ie edge 拥抱chromuim


rest

graphql

大流量，短视频

像抖音也推出小程序

微信小程序跟支付宝小程序相比的优点是```微信流量大```、人群活跃度高。就说现在人们的工作生活很多时间90%都会花费在微信上，而支付宝更多的是在付款和存钱，虽然也会做一些种树啊、养鸡啊等公益活动，但人们花费在支付宝上面的时间并不多。

移动端开发、可视化图表/WebGL、Web Worker、GraphQL、性能优化等等

## TypeScript
* 强类型检查
* T提升代码健壮性和可维护性


