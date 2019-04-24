webpack的模块打包机
webpack可以做的事情：
代码转换、文件优化、代码分割、模块合并、自动刷新、代码校验、自动发布


webpack基于node

webpack常见问题
高级配置
优化策略
ast抽象语法书
webpack中的tapable事件流
掌握webpack流畅 
手写webpack
手写webpack中常见的loader常见的plugin


——————————————-
## webpack安装
- webpack依赖node （在打包的过程中会使用node内置的一些模块）
- 安装本地的webpack
- webpack webpack-cli -D ( -D 表示开发依赖，上线的时候不需要这两个包)
  - webpack4及其更高版本需要安装webpack-cli
  - --save-dev表示安装到项目目录
- 官网指出：从webpack4开始，webpack不需要任何配置。故webpack仍然支持配置文件  即主目录下创建 webpack.config.js文件
- webpack-cli -h 可以查看可设置的参数配置 webpack-cli --entry ./src/index.js --output ./dist/bundle.js
- webpack官方不推荐全局安装，全局安装会锁定你特定版本的webpack，并可能在不同版本的项目中失败。

## webpack可以进行0配置
- 打包工具 -> 输出后的结果（js模块）
- 打包 （js模块化）
- 简单启动webpack打包工具
    - 1、webpack-cli 命令
    - 2、webpack.config.js 配置文件 ，用webpack/webpack-cli命令启动
        - 使用package.json 快速使用webpack  （srcipt字段）
            - private：true 防止意外发布代码
            - 删除main条目，自定义入口文件

## 手动配置webpack
- 默认配置文件的名字 webpack.config.js
```
    let path = require('path');
    modules.exports = {
        mode: '', // 'development' | 'production' | 'none'
        entry: './src/index.js'
        output: {
            filename: 'bundle.js, // 打包后的文件名字
            path: path.resolve(__dirname,'dist') 
            // 路径必须是一个绝对路径,resolve蒋相对路径解析为绝对路径,__dirname表示以当前目录为基础，创建一个dist目录
        }
    }
```
- 为什么webpack.config.js可以自动执行（代码中会自动查询）

## 生成的bundle文件
- 是一个自执行函数，参数为一个对象(key为文件名，value为函数)
    - 函数中：首先定义一个缓存对象，
             接着实现一个require方法，叫做__webpack_require__（这是由于浏览器中不能使用require）
             \__webpack_require__ 方法 传入一个**moduleId**，这个moduleId其实就是某个入口文件
                - 首先检查moduleId对应的缓存是否存在（利用对象的key-value 方法）。如果存在，则返回
                - 如果不存在，赋值一个对象给该缓存对象和一个叫module的对象。该对象有是三个参数
                    - 三个参数分别为 moduleId、l（是否加载完成，bool值）、exports
            。。。。。
- **实质**：
    webpack的大致流程就是把解析的所有模块变成一个对象，然后通过一个唯一入口进行一个递归依赖（），通过一个唯一入口来加载/运行所有文件
- 改变了配置文件的名字（由于会有默认的配置文件名，此时可能找不到配置文件而报错）
    - 解决：npx webpack --config webpack.config.my.js


## Html插件
> 在开发的时候希望通过localhost的方式或者ip地址的方式来访问
- 内部通过**express**来实现静态服务: **webpack-dev-server**
**webpack-dev-server并不会真实打包文件**，只是生成内存中的打包，将文件写在内存中
```npx webpack-dev-server``` 访问生成的ip，它会默认以当前目录作为静态目录（而我们此时是想打开bundle这个文件）
**解决方案**
    ```devServer```作为开发服务器的配置
    ```js
        devServer: {            // 开发服务器的配置
            port: 3000,         // 设置ip端口
            progress: true,     // 加载时候出现滚动条
            contentBase: './build',   // 以build文件作为静态文件目录
            compress: true            // 开启gzip
        },
    ```
    此时需要在build文件下有html文件，但是不可能每次都去新建html文件，为了跑一次就能在build（自己配置的）文件下生成html文件以供访问，那么
    可以使用**html-webpack-plugin**插件
    ```js
        let HtmlWebpackPlugin = require('html-webpack-plugin');
        // ...
        plugins: [ // 放着所有插件
            new HtmlWebpackPlugin({ 
                template: './src/index.html',    // 以该目录下的html文件为模板，将脚本文件插入该html文件
                filename: 'index.html'           // 文件的命名
                hash: true,                      // 给打包的bundle文件打一个hash戳
                minify: {
                    removeAttributeQuotes: true,    // 把html文件中的属性的双括号全部都删除
                    collapseWhitespace:true         // 使html文件折叠
                }
            })
        ]
    ```
    如果希望文件每次输出都不一样，每次修改时生成新的文件，当文件更改的时候不会覆盖
    可以在output文件中加hash
    ```js
    filename: 'bundle.[hash:8].js'
    ```
## 样式处理
不能直接在index.html的文件中加入样式，因为index.html只是一个模版，最终会原封不动地打包到build文件中，最后可能会出现路径问题
也不能在js文件中require样式文件，css文件此时不是一个模块
### loader——转化文件
希望单一
lodaer用法：
    字符串只用一个loader
    多个loader需要[]
    loader的顺序，默认从右往左执行，从上往下执行
    loader还可以写成对象形式（可以配置其他东西）
#### css-loader
该loader主要来解析@import这种语法的
    css中有 @import './a.css'  
#### style-loader 
该loader 把css插入到head标签中
```
    module: {
        rules:[
            {
                test: /\.css/,
                use: ['style-loader','css-loader']
            }
        ]
    }
```
```
    use: [
        {
            loader:'style-loader',
            options: {
                insertAt: 'top'  // 可以插到head样式的最顶部，这样不会覆盖自定义的样式
            }
        },
        'css-loader'
    ]
```
#### less-loader
```npm install less less-loader -D```
同理可以安装sass stylus node-sass sass-loader stylus stylus-loader
```
    test: [/\.less$/,/\.css$/],    // 这里要处理好文件
    use: [
        {
            loader:'style-loader',
            options: {
                insertAt: 'top'
            }
        },
        'css-loader',
        'less-loader'
    ]
```
#### mini-css-extract-plugin : 抽离css样式的loader
单独抽离文件到link中
```npm install mini-css-extract-plugin -D```
使用方法：
```
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
// ...
{
    test: [/\.less/,/\.css/],
    use: [
        MiniCssExtractPlugin.loader, // 创建link标签， 把内容写到link标签里面,代替style-loader的作用
        'css-loader',
        'less-loader'
    ]
}
```
#### postcss-loader
配合**autoprefixer**，这个包可以添加文件，用postcss-loader来处理
```npm install postcss-loader autoprefixer -D```
在css-loader之前解析
但是运行会报错，因为postcss-loader此时不知道要引用哪个包，报错显示 需要一个 配置文件 而且是在src目录下
**解决方案**
    在src目录下添加一个postcss.config.js配置文件
    ```
        // postcss.config.js
        module.exports = {
            plugins:[require('autoprefixer')]  // 引入要使用的包
        }
    ```
#### optimize-css-assets-webpack-plugin && UglifyJsPlugin
压缩优化css
```npm install optimize-css-assets-webpack-plugin -D```
```
    optimization: {   // 优化项目
        minimizer: [
            new UglifyJsPlugin({     // 优化js
                cache: true,   // 是否缓存
                parallel: true,   // 是否并发
                sourceMap: true // 源码映射 ，方便调试
            }),
            new OptimizeCssAssetsWebpackPlugin({}),    // css 的优化
        ]
    },
```
如果只是单独使用optimize-css-assets-webpack-plugin，则js压缩会失效，此时需要加入UglifyJsPlugin
**注意，这两个插件在优化项里面要成效，一定要在production 情况下** // 被坑过！
- 开发环境可以不需要这些设置

## 在webpack中处理js模块
### @babel/core
@babel/core是babel的核心模块，通过调用transform方法转换文件
@babel/preset-env 可以把高级的语法转换为低级的语法
### 配置babel
```npm install babel-loader @babel/core @babel/preset-env -D```
```
    {
        test: /\.js/,
        use: {
            loader: 'babel-loader',  // 把es6 -> es5
            options: {
                presets: [
                    '@babel/preset-env'
                ]
            }
        }
    }
```
如果使用较高级的语法，可能@babel/preset-env不够用，报错如下
Add @babel/plugin-proposal-class-properties (https://git.io/vb4SL) to the 'plugins' section of your Babel config to enable transformation.
意思是说我们可以添加@babel/plugin-proposal-class-properties这个模块来转换
此时配置如下
```
    {
        test: /\.js/,
        use: {
            loader: 'babel-loader',  // 把es6 -> es5
            options: {
                presets: [
                    '@babel/preset-env'
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties'   // 内部小插件
                ]
            }
        }
    },
```


## 全局变量引入问题
### loader
**pre** 前面执行的loader
**normal** 普通的loader
**内联loader**
**后置loader**
为了将iquery的$暴露给window，可以以下四种方式：
- 内联loader：
    import $ from 'expose-loader?$!jquery';
    console.log(window.$);
- 配置到rules中
    import $ from 'jquery';
    {
        test: require.resolve('jquery),   // 只要引用到jquery则使用这个loader
        use: 'expose-loader?$'
    }
- 默认可以拿到$ ：在每个模块中注入$
```
    let webpack = require('webpack');
    // 
    plugins: [
        // ...
        new webpack.ProvidePlugins: {  // 在每个模块中都注入 $,在window中拿不到
            $: 'jquery'
        }
    ]
```
```
    // 正常使用
    console.log($);
```
- 如果已经引入了jquery，则为了避免打包使得文件太大，则需要**忽略打包**
```
    module.exports = {
        // ...
        externals: {
            jquery: "jQuery"
        }
    }
```


### webpack.ProvidePlugins 
ProvidePlugins是webpack的全局挂载插件（webpack内置插件）
```
new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
}))
```
当使用这些变量的时候，webpack会自动挂载。（区别于window挂载）
**在每个模块中注入**

## 图片处理: file-loader &&  html-withimg-loader && url-loader
> webpack引入图片
1）在js中创建图片来引入
    **file-loader默认会在内部生成一张图片 到build目录下**
    一般来说，直接image.src = ‘’；这样字符串中的内容不会被执行
    如果想要向js那样require进来，那么就需要用一个loader来解析图片
```js
    // 把生成图片的名字返回回来
    // 把图片引入，返回来的结果是一个新的图片的地址，并输入到build目录下
    // 在测试过程中我是把图片放在src下
    import logo from './lucky.png'; 
    let image = new Image();
    image.src = logo;
    document.body.appendChild(image);
    console.log(logo);
```
    file-loader配置
```js
    {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader'
    },
```
2）在css引入 background-url
3）<img src="" alt="" />
    由于我们打包了资源到build目录下，如果此时直接引入路径，是找不到相应资源的，所以需要用一个loader
    **html-withimg-loader** 
    html-withimg-loader 是中国人写的 可以解析html，帮助我们编译我们的图片,使得在html中也可以使用src引入的图片
    ```js
        // ...
        {
            test: /\.html$/,         // 这里的正则居然加了引号！！导致解析失败！
            use: 'html-withimg-loader'
        },
    ```
**url-loader**
    可以实现将图片资源放在某个文件夹下，
    将文件进行限制，
    加上前缀
```js
    {
        // 做一个限制，当我们的图片小于多少k的时候使用base64转换图片
        // 否则用file-loader产生真实的图片
        loader: 'url-loader',
        options: {
            limit: 1,
            outputPath: '/img/', // 告诉将图片的输出路径，此时build下的文件都会自动变成img路径下，自动（这里最好加一个/）
            publicPath: 'http://www.test.cn'  // 将文件划分
        }
    }
```
如果想要**将所有的文件都加上cdn前缀**，则可以在module.exports的ouput属性下直接添加```publicPath: 'http://www.test.cn' ```

## 打包多页应用
使用**html-webpack-plugin**以某个html文件为模版，并插入对应的脚本文件
关键**chunks属性**可以对应一个js文件
```js
    const path = require('path');
    let HtmlWebpackPlugin = require('html-webpack-plugin');
    module.exports = {
        mode: 'development', // 这个不加，会有恶心的提示
        // 多入口
        entry: {
            home: './src/index.js',
            other: './src/other.js'
        },
        output: {
            filename: '[name].js', 
            // 【name】是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件
            path:path.resolve(__dirname,'dist') // __dirname，resolv表示在当前目录下创建一个dist目录，并将打包好的文件都放在该目录下
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './index.html', // 将index.html作为模版
                filename: 'home.html',    // 以index.html为模版加载进对应js文件之后生成另一个home.html文件
                chunks: ['home']       // 如果不加这个选项就会导致home.html会包含两个js文件
            }),
            new HtmlWebpackPlugin({
                template: './index.html',
                filename: 'other.html',
                chunks: ['other']
            })
        ]
    }
```

## 配置source-map
安装babel来编译es6语法
```npm install @babel/core babel-loader @babel/preset -D```
**devtool是和entry同级的属性**
1）源码映射 会单独生成一个dourcemap文件 出错了 会标示 当前报错的列和行 大 和 全
```
devtool: 'source-map
```
2) 不会产生单独的文件，但是可以显示行和列
```
devtool: 'eval-source-map‘
```
3) 不会产生列，但是是一个单独的映射文件
``
`devtool: 'cheap-module-source-map'
```
4) 不会产生文件，集成在打包后的文件中，不会产生列
```
devtool: 'cheap-module-eval-source-map'
```

## watch的用法
监控当前代码的变化，一旦变化就会重新build
```js
    watch: true,  // build文件可以实时编译
    watchOptions: {  // 监控的选项
        poll: 1000, // 每秒 问我多少次，(一秒运行1次
        aggregateTimeout: 500, // 防抖，500ms内输入的代码只会打包一次
        ignored: /node_modules/   // 不需要监控哪个文件
    },
```

## webpack小插件应用
1）cleanWebpackPlugin
```js
    let CleanWebpackPlugin = require('clean-webpack-plugin');
    // ...
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns:['./dist']     //  每次打包之前删掉dist目录 
    })
```
2) copyWebpackPlugin
一些静态资源也希望拷贝到dist中
```js
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    const config = {
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/doc', to: './public'}   
            // 可以把doc下的文件原封不动地拷贝到public目录下
        ])
    ]
    }
```
3) bannerPlugin 内置
版权声明注释（谁谁谁写的代码）
由于是webpack内置的，所以配置中需要引入webpack
```js
    let webpack = require('webpack');
    // ..
    module.exports = {
        // ...
        plugins: [
            // ...
            new webpack.BannerPlugin('make 2019 by yxz') // 会打包到每一个文件的头部
        ]
    }
```

## webpack跨域问题
**webpack-dev-server自己带了node的一个服务器框架express**
所以我们安装了webpack-dev-server之后就可以require express了
```js
    // server.js 服务端
    let express = require('express');
    let app = express();
    app.get('/api/user',(req,res) => {
        res.json({name: 'yxz,fighting!'});
    })
    app.listen(3000);
```
```js
    // index.js 前端
    let xhr = new XMLHttpRequest();
    xhr.open('GET','/api/user',true);

    xhr.open = function() {
        console.log(xhr.response);
    } 
    xhr.send(); 
```
但是发现浏览器会提示跨域，因为这里我们 前端默认开启的是8080端口，但是服务端写的是3000端口
**解决方案**
**1、http-proxy 代理**
- 前端代理访问
```js
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'  
            // 意思是说只要前端访问的url中有api开头的则去这个端口找
            // 将webpack-dev-server的可以将请求转发给3000端口
            // 所以启动命令的时候需要启动webpack-dev-server
        }
    },
```
但是这里会出现一个问题，如果请求的比较多，那就会有很多 ./././
其实可以请求的时候也可以以api开头，只是转发的时候把api去掉  
配置如下：
```js
    proxy: {
        '/api': {     // 通过重写的方式，把请求代理到服务器上
            target: 'http://localhost:3000',
            pathRewrite: {
                '/api': ''
            }
        }// 配置一个代理
        // 意思是说只要前端访问的url中有api开头的则去这个端口找
    }
```
这种情况下，可以即使请求有api开头，就会转发到对应的服务器接口，服务器接口此时如下：
```js
    let express = require('express');
    let app = express();
    app.get('/user',(req,res) => {      // 这里服务器删除了/api还是可以访问到
        res.json({name: 'yxz,fighting!！！！'});
    })
    app.listen(3000);
```
**2、我们前端只想单独模拟mock数据**
内部本来就是一个express，那么就用express的一个钩子
before(){   // 钩子

}
具体配置：
```js
    devServer: {
        before(app) {   // 钩子函数
            app.get('/user',(req,res) => {
                res.json({name: 'yaoxuzhen'});
            });
        }
    }
```
上面这个配置我们就可以直接访问/user 来模拟mock数据了
```js
// index.js
xhr.open('GET', '/user', true);
```
**3、有服务端 不想用代理处理——在服务端中启动webpack，且端口用webpack端口: webpack-dev-server** 
也就是说服务端和客户端在一个端口上，这样就不会有跨域存在！！！
大致流程：
**webpack拿到配置对象，得到编译对象，交给middle处理就好**
意味着我们是怎么配置webpack的，webpack根据配置打包（这仅限于在服务端写html！！）
意味访问端口就可以启动webpack
```js
    let express = require('express');
    let app = express();
    let webpack = require('webpack');
    let middle = require('webpack-dev-middleware'); // 这个中间件可以在服务端启动webpack
    let config = require('./webpack.config.js');
    let compiler = webpack(config);
    app.use(middle(compiler));
    app.get('/user',(req,res) => {
        res.json({name: 'yxz,fighting!！！！'});
    })
    app.listen(3000);   
```
## resolve属性的配置 （重要）
```resolve 是module.exports的一个属性```
resolve——解析
当我们在代码块中引用第三方的包的时候的一些相关配置
```js
    resolve: {  // 解析第三方包  common  
        modules: [path.resolve('node_modules')],  // 找的时候就在当前目录查找，不要再去上级目录查找了
        alias: { // 别名
            bootstrap: 'bootstrap/dist/css/bootstrap.css'   
            // 这是由于如果我们直接import bootstrap ，这个模块下的package.json是默认去加载bootstrap/dist/js/bootstrap.js（而此时我们要的其实是js文件）
        },
        // 下面这个mainFields属性一般和前面那个别名属性 不会重复使用吧。。
        mainFields:['style','main'],// 表示入口字段，对于bootstrap包，配置先去style下找，没有的话再去main下找（包一般都会有多个入口字段）
        extensions: ['.js','.css','.json','.vue'] // 用于当我们省略文件后缀的时候，查找文件顺序（从左往右）
    },
```

## 定义环境变量
**webpack.DefinePlugin** webpack自带的插件
- 在代码中注入一个环境变量，让我们根据环境变量可以切换相应的状态/数据

// 不能直接 DEV：‘production’ 因为这样编译之后会去掉单引号而变成一个变量，导致可能找不到 
// 而‘true’会直接转换成布尔类型
```js
    new webpack.DefinePlugin({
        DEV: JSON.stringify('production'), 
        FLAG: 'true'   
    })
```

## 区分不同环境
需要三个文件：
    webpack-base.js
    webpack-prod.js
    webpack-dev.js
（ 其中，webpack-base.js表示公共配置
        webpack-prod.js表示生产环境下的配置
        webpack-dev.js标示开发环境下的配置 ）
**插件：webpack-merge**
可以帮助我们合并配置文件 
```npm install webpack-merge -D```
把公共配置写在webpack-base.js中
运行命令的时候需要指定配置文件,**主要是利用插件暴露的方法来实现**
```npm run build --  --condig webpack.dev.js``` 
(注意这里需要加上 -- )
```js
// webpack-dev.js
let {smart} = require('webpack-merge');
let base = require('./webpack.base.js');
module.exports = smart(base,{
    mode: 'development',
    devServer: {

    },
    devtool: 'source-map'
})
```
```js
let {smart} = require('webpack-merge');
let base = require('./webpack.base.js');

module.exports = smart(base,{
    mode: 'production',
    optimization: {
        minimizer: [
        ]
    }
})
```

# webpack优化
> noParse
> exclude && include
> webpack.IgnorePlugin
> dllPlugin
> happypack
> webpack自带优化 
    > tree-shaking  去掉不用的代码  （生产环境下生效）
    > scope hosting 作用域提升（自动计算）     （生产环境下生效）
> 抽取公共代码
> 懒加载
> 热更新 （只更新修改的部分,在开发环境下使用）
**noParse**
—— 不去解析某个没有依赖的库，减少打包时间（比如jquery）
—— 和module.rule同级
**exclude && include** （排除和包含）
- exclude 表示在解析时忽略的目录
    比如，解析js文件时并不需要去 node_module 中找
    ```exclude: /node_module/,```
- include 表示只找某个目录
    ```include: path.resolve('src'),```表示只找src目录
**webpack.IgnorePlugin插件**
moment包是一个很好的包，但是内容太全了，包含了很多其他语言的包，所以打包出来会比较大，此时看完moment的有关配置之后, 其实是可以**忽略的**
- 插一个小tip：引入中文包：
    ```moment.locale('zh-ch')``` // 设置语言
- 忽略moment包中非中文的包
-  **使用webpack.IgnorePlugin插件**
    ```js
    new webpack.IgnorePlugin(/\.\/locale/,/moment/), // 如果在moment中引用到.locale就忽略掉
    ```
**dllPlugin** —— 任务清单
- 我们会发现打包好的代码虽然有return语句，但是并没有被接收，我们除了可以手动接收，也可以使用webpack自带的插件
- **动态链接库**
```js
    devServer: {
        port: 3000,
        open: true, // 自动打开浏览器
        contentBase: './dist'
    },
```
```js
    import React from 'react';
    import {render} from 'react-dom';
    render(<h1>jsx</h1>,window.root);
```
但是这样打包之后文件会比较大，所以第三方可以单独打包
方式:
1、首先将react和react-dom单独打包到一个文件中
配置一个webpack.react.config.js文件，跑命令的时候记得加上这个配置
2、配置文件输出模式
3、利用webpack自带的插件 webpack.DllPlugin 设置： 去mainfest
.json中查找 第三方文件
```js
// 单独打包
// 优化
let path = require('path');
let webpack = require('webpack');
module.exports = {
    mode :'development',
    entry: {
        react: ['react','react-dom'],
    },
    output: {
        filename: '_dll_[name].js', // 产生的文件名
        path: path.resolve(__dirname,'dist'),
        library: '_dll_[name]',  // 默认把bundle return的结果返回给 ab 变量
        libraryTarget: 'commonjs'  // commonjs var js umd ...模式
    },
    // 设置这两个模块作为动态连接库
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.resolve(__dirname,'dist','mainfest.json')
            // dllPlugin可以从任务清单mainfest.json中查找是否存在引入的文件，存在则引入，不存在打包。（避免不必要的文件打包加大文件体积）
        })
    ]
}
```
4、配置正式文件，引用动态链接库（mainfest.json）
```js
    // webpack.config.react.js
    new webpack.DllReferencePlugin({
        manifest:path.resolve(__dirname,'dist','mainfest.json') // 先去查找这个清单，找不到的话就再去打包，会发现打包后的文件变小
    }),
```
5、在html文件中引入这个动态链接库，否则不会去查找
```<script src="/_dll_react.js"></script>```
**happypack**
- 实现多线程打包的第三方模块
但是分配线程的过程也会消耗一些时间，所以在文件比较小的情况下，用多线程打包反而会变慢
```js
module: {
    rules: [
        {
            test: /\.js/,
            exclude: /node_module/,
            include: path.resolve('src'),
            use: 'Happypack/loader?id=js'
        },
        {
            test: /\.css/,
            use: 'Happypack/loader?id=css'
        },
    ]
},
// ...
plugins: [
    new Happypack({
        id: css,
        use: ['style-loader','css-loader']
    }),
    new Happypack({
        id: js,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }
        }]
    }),
    // ...
]
```
**webpack自带优化**
- **tree-shaking**  自动去掉不用的代码
import在**生产环境下**会自动取出没有用到的代码
es6模块会把结果放到default上（modules，使用的时候需要 obj.default.sum(1,2)）
如果使用的是 require ，就不会自动删除没有用的代码，所以！！**前端最好使用import语法**
- **scope hosting**  作用域提升
比如代码：
```js
    let a = 1;
    let b = 2;
    let c = 3;
    let d = a + b + c;
    // 其实直接给d赋值1+2+3就可以了，但是在浏览器中就需要声明解析
    // scope hosting可以帮助我们直接得到结果，省去计算
```

**(多页面)抽取公共代码**
配置多入口，这几个入口引用了同一文件，所以需要处理
提取公共代码的好处，相同文件引用只下载一次，然后缓存，其他文件需要引用的时候不需要重复下载
```js
    optimization: {
        splitChunks: {      // 分割代码块
            cacheGroups: {  // 缓存组
                common: {   // 公共的代码块
                    chunks: 'initial',  // 表示一开始的时候就抽离
                    minSize: 0,        // 表示文件大于多少size的时候就进行抽离
                    minChunks: 2        // 公共模块被重复两次就进行抽离
                },
                vendor: {
                    priority: 1,    // 加上权重，避免抽离完公共模块之后 以为 抽离结束 而不执行第三方模块的抽离
                    test: /node_modules/, // 把引用到的第三方模块抽离出来
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 2
                }
            }
        },
    },
```
**懒加载**
使用import('').them(data=>{}) 实现懒加载
实际上 vue react 路由懒加载都是这么实现的
但是由于这样的语法还是草案语法，报错提示我们需要安装一个babel：
    ```@babel/plugin-syntax-dynamic-import 语法动态倒入的插件```
```js
// source.js
export default 'yxz'
```
```js
// index.js
let button = document.createElement('button');
button.innerHTML = 'hello';
button.addEventListener('click',function() {
    // es6 草案中的语法，jsonp实现动态加载文件，返回一个promise
    import('./source.js').then(data => {
        console.log(data.default);
    })
});
document.body.appendChild(button);
```
记得要加上插件！！
```js
    rules: [
        {
            test: /\.js/,
            exclude: /node_module/,
            include: path.resolve('src'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import'
                    ]
                }
            }
        }
    ]
```
**热更新**
1、启动热更新
```js
    devServer: {
        hot: true,
        port: 3000,
        open: true, // 自动打开浏览器
        contentBase: './dist'
    },
```
2、配置webpack的插件
```js
    new webpack.NamedModulesPlugin(), // 打印更新的模块路径
    new webpack.HotModuleReplacementPlugin() // 热更新插件
```
3、使用
```js
    import str from './source';
    console.log(str);
    if (module.hot) {
        module.hot.accept('./source',() => {
            let str = require('./source');
            console.log(str.default);
        })
    }
```
## tapable  (Webpack 依赖的核心库)
Webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**，是对前端项目实现自动化和优化必不可少的工具，Webpack 的 loader（加载器）和 plugin（插件）是由 Webpack 开发者和社区开发者共同贡献的，而目前又没有比较系统的开发文档，**想写加载器和插件必须要懂 Webpack 的原理，即看懂 Webpack 的源码**，tapable 则是 Webpack 依赖的核心库，可以说不懂 tapable 就看不懂 Webpack 源码，(下面会对 tapable 提供的类进行解析和模拟）。

tapable 有点类似nodejs中的events库，**核心原理也是依赖于发布订阅模式**。
- 介绍
* Webpack 本质上是一种事件流的机制，
    * 它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 tapable，
* Webpack 中最核心的，负责编译的 **Compiler** 和负责创建  bundles 的 **Compilation** 都是 tapable 构造函数的**实例**。
#### 钩子  （不同的事件流执行机制）
Webpack 4.0 的源码中一定会看到下面这些以 Sync、Async 开头，以 Hook 结尾的方法，这些都是 tapable 核心库的类，为我们提供不同的事件流执行机制，我们称为 “钩子”。
```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
 } = require("tapable");
```
上面的实现事件流机制的 “钩子” 大方向可以分为两个类别，“同步” 和 “异步”
- “异步” 又分为两个类别，“并行” 和 “串行”
- 而 “同步” 的钩子都是串行的

需要安装这个第三方模块（虽然安装webpack后已经自带了）
```npm install webpack```

-- tapable库中一共有三种注册方法  tap tapAsync tapPromise
#### Sync 类型的钩子
>SyncHook
>SyncBailHook
>SyncWaterfallHook
>SyncLoopHook

- SyncHook
创行同步执行，不关心事件处理函数的返回值，在触发事件之后没，会按照事件注册的先后顺序执行所有的事件处理程序
###### 如何使用
```js
let { SyncHook } = require('tapable');
class Lesson {
    constructor() {
        this.hooks = {
            arch: new SyncHook(['name']),    // arch是一个钩子的实例，数组内存储事件触发传入的参数
            // 也可以写多个钩子 
        }
    }
    tap() { // 注册监听函数  （在钩子上注册函数，钩子启动的时候让这些函数依次执行
        // 注册钩子调用实例的tao方法，第一个参数只是一个标示，没有实际意义，只是为了方便开发，第二个参数是一个回调
        this.hooks.arch.tap('node',function(name){   // 创建实例时有多少个参数，这里的回调就只能有多少个参数
            console.log('node', name);
        });
        // 事件的名字可以一样，也可以不一样，只是为了方便
        this.hooks.arch.tap('react',function(name){
            console.log('react',name);
        })
    }
    start(){
        this.hooks.arch.call('xz');    // 在实例上注册事件之后会将事件存到数组中，调用call函数之后会依次调用数组中的函数
    }
}
let l = new Lesson();
l.tap();     // 注册这两个事件
l.start();   // 启动钩子
```
###### 模拟SyncHook类
```js
class SyncHook {
    constructor(name){
        this.tasks = [];
    }
    tap(name,task) {
        this.tasks.push(task); // 相当于一次订阅
    }
    call(...args) { // 可能会有多个数组
        this.tasks.forEach((task) => task(...args));
    }
}
```
- SyncBailHook
同样为串行同步执行，**如果事件处理函数执行时有一个返回值不为空（即返回值为 undefined），则跳过剩下未执行的事件处理函数**（如类的名字，意义在于**保险**）。也就是说我们可以决定是否继续执行下面的函数。
可以随时停止监听
**模拟**   (只要修改call函数就好了)
```js
call(...args) { // 可能会有多个数组
    let ret; // 当前函数的返回值
    let index = 0;
    do {
        ret = this.tasks[index++](...args);
    }while(ret === undefined && index < this.tasks.length)
}
```
- SyncWaterfallHook
SyncWaterfallHook 为串行同步执行，**上一个事件处理函数的返回值作为参数传递给下一个事件处理函数**，依次类推，正因如此，只有第一个事件处理函数的参数可以通过 call 传递，**而 call 的返回值为最后一个事件处理函数的返回值。**
```js
// 模拟
call(...args) { 
    let [first,...others] = this.tasks;
    let ret = first(...args);
    others.reduce((a,b)=>{   
        return b(a);
    },ret);
}
```
分别为第一个事件处理函数，和存储其余事件处理函数的数组，使用 reduce 进行归并，将第一个事件处理函数执行后的返回值作为归并的初始值，依次调用其余事件处理函数并传递上一次归并的返回值。
- SyncLoopHook
遇到某个钩子的时候可以循环执行
SyncLoopHook 为串行同步执行，**事件处理函数返回 true 表示继续循环**，即循环执行当前事件处理函数，返回 undefined 表示结束循环，SyncLoopHook 与 SyncBailHook 的循环不同，**SyncBailHook 只决定是否继续向下执行后面的事件处理函数，而 SyncLoopHook 的循环是指循环执行每一个事件处理函数，直到返回 undefined 为止，才会继续向下执行其他事件处理函数，执行机制同理。**
```js
// 模拟
this.hooks.arch.tap('node',(name) => { 
    console.log('node', name);
    return ++this.index === 3?undefined:'继续学';
});
```
```js
// 修改部分
call (...args) {
    this.tasks.forEach(task => {
        let ret
        do {
            ret = task(...args);
        } while(ret !== undefined)
    })
}
```
// 注意此时 想要执行的函数数组中没有循环的函数不能返回其他值 否则会死循环。
即：
```js
ss.tap('react',function(name) {
    console.log('node', name);
    return ++total === 3?undefined:'继续学';
});
ss.tap('node',function(name) {
    console.log('1',name);
    // return 'hello2';
});
ss.tap('webpack',function(name) {
    console.log('2',name);
    // return 'hello3';
});
```
#### Async 类型的钩子
异步的场景

Async 类型可以使用 tap、tapSync 和 tapPromise 注册不同类型的插件 “钩子”，分别通过 call、callAsync 和 promise 方法调用.

>AsyncParallelHook
    >AsyncParalleBaillHook  带保险
>AsyncSeriesHook    异步串行
>AsyncSeriesWaterfallHook    异步串行

- AsyncParallelHook
AsyncParallelHook 为**异步并行执行**，
通过 tapAsync 注册的事件，通过 callAsync 触发
通过 tapPromise 注册的事件，通过 promise 触发（返回值可以调用 then 方法）。
// 模拟
```js
class AsyncHook {  
    constructor(args) {  
        this.tasks = []
    }
    tapAsync(name, task) {
        this.tasks.push(task);
    }
    callAsync (...args) {
        let finalCallback = args.pop();
        let index = 0;
        let done = () => {      // 注意这里用到了this  所以要用到箭头函数
            if (index == this.tasks.length){
                finalCallback();
            }
        }
        this.tasks.forEach(task => {
            task(...args,done);
        })
    }
}
let ss = new AsyncHook(['name']);
let total = 0;
ss.tapAsync ('react',function(name,cb) {
    setTimeout(() => {
        console.log('react', name);
        cb();
    },1000);
});
ss.tapAsync('node',function(name,cb) {
    setTimeout(() => {
        console.log('node', name);
        cb();
    },1000);
});
ss.callAsync('hello',function() {
    console.log('end');
});
```
**利用tappromise**
```js
class AsyncParallelHook {  
    constructor(args) {  
        this.tasks = []
    }

    tapAsync(name, task) {
        this.tasks.push(task)
    }

    tapPromise(name, task) {
        this.tasks.push(task)
    }
    callAsync(...args) {
        let finalCallback = args.pop()   // 拿出最终的函数
        let index = 0
        let done = () => {   // 类似promise.all的实现
            index++;
            if (index === this.tasks.length) {
                finalCallback();
            }
        }
        this.tasks.forEach(task => {
            task(...args, done) // 这里的args 已经把最后一个参数删掉
        })
    }

    promise(...args) {
        let tasks = this.tasks.map(task => task(...args))
        return Promise.all(tasks)
    }
}
let hook = new AsyncParallelHook(['name'])
hook.tapPromise('react', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('react', name);
            resolve()
        }, 1000)
    })
})

hook.tapPromise('node', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('node', name);
            resolve()
        }, 1000)
    })
})
hook.promise('jw').then(function () {
    console.log('end');
})
```
这里主要利用的是 现将每个函数（每个函数都返回一个promise/注意要调用resolve）生成的promise map到一个新的数组。将这个数组传给promise.all 并返回 就可以执行then 的回调了

- AsyncSeriesHook 
有点像express的源码
```js
class AsyncSeriesHook {  
    constructor(args) {  
        this.tasks = []
    }
    tapAsync(name, task) {
        this.tasks.push(task)
    }
    tapPromise(name, task) {
        this.tasks.push(task)
    }
    callAsync(...args) {            // 手动调用
        let finalCallback = args.pop()
        let index = 0;
        let next = () => {
            if (this.tasks.length === index) return finalCallback();
            let task = this.tasks[index++];
            task(...args, next);
        }
        next();
    }
    promise(...args) {              //  注意有两个return
        // 将promise串联起来
        let [first, ...other] = this.tasks
        return other.reduce((p, n) => {
             return p.then(() => n (...args))
        }, first(...args))
    }
}

let hook = new AsyncSeriesHook(['name'])
// hook.tapAsync('react', function (name, callback) {
//     setTimeout(() => {
//         console.log('react', name);
//         callback()
//     }, 1000)
// })
// hook.tapAsync('node', function (name, callback) {
//     setTimeout(() => {
//         console.log('node', name);
//         callback()
//     }, 1000)
// })
//
// hook.tapAsync('webpack', function (name, callback) {
//     setTimeout(() => {
//         console.log('webpack', name);
//         callback()
//     }, 1000)
// })

hook.tapPromise('react', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('react', name);
            resolve()
        }, 1000)
    })
})

hook.tapPromise('node', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('node', name);
            resolve()
        }, 1000)
    })
})
// hook.callAsync('jw', function () {
//     console.log('end');
// })
hook.promise('jw').then(function () {
    console.log('end');
})
```
- AsyncSeriesWaterfallHook
```js
class AsyncSeriesWaterfallHook {  //
    constructor(args) {  // args => ['name']
        this.tasks = []
    }

    tapAsync(name, task) {
        this.tasks.push(task)
    }

    tapPromise(name, task) {
        this.tasks.push(task)
    }
    callAsync(...args) {
        let finalCallback = args.pop()
        let index = 0;
        let next = (err, data) => {
            let task = this.tasks[index]     
            if(!task) return finalCallback();
            if (index === 0) {
                // 执行的第一个
                task(...args, next) 
            } else {
                task(data, next)
            }
            index ++
        }
        next();
    }

    promise(...args) {
        // 将promise串联起来
        let [first, ...other] = this.tasks
        return other.reduce((p, n) => {
             return p.then((data) => n(data))
        }, first(...args))
    }
}
let hook = new AsyncSeriesWaterfallHook(['name'])


// hook.tapAsync('react', function (name, callback) {
//     setTimeout(() => {
//         console.log('react', name);
//         callback(null, '结果1')
//     }, 1000)
// })
//
// hook.tapAsync('node', function (name, callback) {
//     setTimeout(() => {
//         console.log('node', name);
//         callback(null, '结果2')
//     }, 1000)
// })
//
// hook.tapAsync('webpack', function (name, callback) {
//     setTimeout(() => {
//         console.log('webpack', name);
//         callback()
//     }, 1000)
// })

//
hook.tapPromise('react', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('react', name);
            resolve('result')
        }, 1000)
    })
})

hook.tapPromise('node', function (name, callback) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('node', name);
            resolve()
        }, 1000)
    })
})
//
//
// hook.callAsync('jw', function () {
//     console.log('end');
// })

hook.promise('jw').then(function () {
    console.log('end');
})
```




https://www.bilibili.com/video/av41371417/?p=26    看完了热更新了！！
npx是什么东西