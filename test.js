// // 先把移动布局 rem 之类的（有一篇博文 是 有看到的）

// // 看 正则

// // 移动端手势

// // web app

// // node

// // 基础

// // 物理像素，逻辑像素？？viewpoint??rem适配的方法，touch事件？？

// // 移动web必备的解决方案
// 300ms延迟点击 
// 多tab页面懒加载 
// 1px边框 
// CSs伪类妙用 
// 滚动加载数据 
// 移动web输入款 
// 为什么乘10而不是20 
// 如何在移动端上调试（真机调试）
// 吸顶

// 为什么css是从右往左解析

// setTimeout 的时间戳 0 1 2 3 < 4

// // 想象看还有什么需要进一步学习？？

// zepto这个库

// 4.29 淘系 cookie token session 区别和场景以及注意点


// 农村淘宝是阿里巴巴集团的战略项目，通过与各地 zf 深度合作，以电子商务平台为基础，搭建县村两级服务网络，充分发挥电子商务优势，突破物流、信息流的瓶颈，人才和意识的短板，实现“网货下乡”和“农产品进城”的双向流通功能。加速城乡一体化，吸引更多的人才回流创业，为实现现代化、智能化的“智慧农村”而积基树本。

// 主要是用使用「 weex 」开发无线业务以及「 react 」「 node 」 开发 PC 业务
// aparadeway
// weex是不是只有阿里在用？
// Weex官网的解释是 Weex 是一个动态化的高扩展跨平台解决方案。就我的理解就是为了达到写一份代码可以同时在移动端（Android端、iOS端），Web端 同时运行的目的而开发的一系列系统或者提出了解决方案。这个系统方案包含各种native sdk、weex项目、构建工具、调试工具、文档等等。

var obj={
    'name':'yy',
    'age':'18',
    'val': () => {
        console.log(this)
    },
    'other': function() {
        'use strict'
        setTimeout( () => {
            console.log(this)
        },0)
    },
    'another': function() {
        'use strict'
        setTimeout(function(){
            console.log(this)
        },0)
    }
}
obj.other() // obj 对象
obj.another() // 无论是不是严格模式都返回一个Timer对象！神奇吧！









