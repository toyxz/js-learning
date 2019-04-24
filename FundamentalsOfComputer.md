## 计算机基础

>介绍一下对于 http 的理解？
* http 是 client和server 沟通 时需要遵循的 规范，一种通信的协议
    * 在OSI参考模型中 是基于 TCP/IP 协议的应用层协议，默认使用80端口。
* http的特点
    http是一种无状态无连接的协议，所谓的无状态是每一次http链接都没办法记住当前的状态/身份信息等。由于这种缺点，引入cookie和session来保存状态信息。
* http的数据包结构
    分为 请求行 请求头 空行 请求体
    * 请求行 包括 ：请求方法 请求的url http协议
    * 请求头 ：User-Agent（产生请求的浏览器类型）、Accept：客户端可识别的内容类型列表 等
    * 空行： 发送回车符和换行符，通知服务器以下不再有请求头
    * 请求数据/体： 一般是post方法发送的参数的数据
* http的工作过程
    * 地址解析，从中分解出协议名、主机名、端口、对象路径等部分
    * 封装HTTP请求数据包，把以上部分结合本机自己的信息，封装成一个HTTP请求数据包
    * 封装成TCP包，建立TCP连接（TCP的三次握手）
    * 客户机发送请求命令
    * 服务器响应
    * 服务器关闭TCP连接

* http状态码
    * 200 OK：客户端请求成功。
    * 301：永久性重定向
    * 302：临时重定向
    * 400 Bad Request：客户端请求有语法错误，不能被服务器所理解。
    * 401 Unauthorized：请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用。
    * 403 Forbidden：服务器收到请求，但是拒绝提供服务。
    * 404 Not Found：请求资源不存在，举个例子：输入了错误的URL。
    * 500 Internal Server Error：服务器发生不可预期的错误。
    * 503 Server Unavailable：服务器当前不能处理客户端的请求，一段时间后可能恢复正常，举个例子：HTTP/1.1 200 OK（CRLF）。
* http需要先进行TCP三次握手
    * http协议只定义了应用层的东西，下层的可靠性要传输层来保证，但是没有说一定要用tcp，只要是可以保证可靠性传输层协议都可以承载http
    * 关于TCP握手
* http1.0、 1.1 、2 、3 的区别
    * http 1.0 主要有三个命令 GET POST HEAD，在http/1.0时代，每一个请求都会重新建立一个tcp链接，一旦响应返回，就关闭连接。
    * http1.1新增了```keep-alive```功能，当浏览器建立一个TCP连接时，多个请求都会使用这条连接。（现在大多数浏览器默认都是开启的）,这样可以减少TCP握手的时间消耗。在一个TCP连接中，同一时间只能发送一个请求，并且需要等响应完成后才发送第二个请求。因此```HTTP/1.1制定了pipeLining管道```。通过这个管道，浏览器的多个请求可以同时发到服务器，但是服务器的响应只能够一个接着一个的返回（但有些浏览器不支持）
        * 同一域名最多只能建立六个连接，我们可以使用```子域名来减少所有资源在只有一个连接时的产生的排队延迟``
        * http1.1还支持```断点续传```，HTTP状态码应该是206。客户端在HTTP头中增加：Range，服务端收到断点续传请求后添加状态头Content-Range。断点续传遇到文件修改，If-Modified-Since/ETag头
    * 针对前面提到的1.0 1.1的特性，http2.0提出一些新的特性或者说是方法。（2015年正式发表）
        * ```二进制分帧```
            * 在应用层与传输层之间增加一个二进制分帧层。在二进制分帧层上，HTTP2.0会将所有传输的消息分割成更小的消息和帧。
        * ```压缩头部```
            * HTTP2.0规定了在客户端和服务端会使用并且维护【首部表】来跟踪和存储之前发送的键值对，对于相同的头部，不必再通过请求发送，只需发送一次。
事实上，如果请求中不包含首部（例如对同一资源的轮询请求）那么首部开销就是零字节。此时所有首部都自动使用之前请求发送的首部。
如果首部发生了变化，那么只需要发送变化了数据再Headers帧里面，新增或修改的首部帧会被追加到“首部表”。首部表再HTTP2.0的连接存续期内始终存在，由客户端和服务器共同渐进地更新。
        * ```多路复用```
            * 在一条连接上，我可以同时发起无数个请求，并且响应可以同时返回。
.客户端和服务器可以把HTTP消息分解为互不依赖的帧，然后乱序发送，最后再在另一端把它们重新组合起来。
于http2.0让所有数据流共用一个链接，可以更有效地使用TCP连接，让高带宽也能真正地服务于HTTP的性能提升。故“资源合并请求”的优化手段对于http2.0来说是没有效果的，只会增大无用的工作量而已。
        * ```请求优先级```
            * 由于所有的资源都是并行发送，可以对重要的文件进行先运输，加速页面的渲染。
        * ```服务器推送```在 HTTP2.0中，服务器推送是指在客户端请求之前发送数据的机制。如果一个请求是由你的主页发起的，服务器很可能响应主页内容、logo以及样式表，因为它知道客户端会用到这些东西。这相当于在一个 HTML 文档内集合了所有的资源，不过与之相比，服务器推送有一个很大的优势：可以缓存！
        * 虽然 HTTP/2.0 协议并没声明一定要用 SSL，但是 Google Chrome 等浏览器强制要求使用 HTTP/2.0 必须要用上 SSL， 也就是说必须要。
* http2：
    * 为什么需要头部压缩？
        * 假定一个页面有100个资源需要加载（这个数量对于今天的Web而言还是挺保守的）, 而每一次请求都有1kb的消息头（这同样也并不少见，因为Cookie和引用等东西的存在）, 则至少需要多消耗100kb来获取这些消息头。HTTP2.0可以维护一个字典，```差量更新```HTTP头部，大大降低因头部传输产生的流量。
 
    * HTTP2.0多路复用有多好？
        * 之前就提到了，```http性能取决于带宽和延迟连个方面，现在带宽已经很好了，几乎不再是阻碍，真正的阻碍是延迟！```   HTTP 性能优化的关键并不在于高带宽，而是低延迟。TCP 连接会随着时间进行自我「调谐」，起初会限制连接的最大速度，如果数据成功传输，会随着时间的推移提高传输的速度。这种调谐则被称为 TCP 慢启动。由于这种原因，让原本就具有突发性和短时性的 HTTP 连接变的十分低效。HTTP/2 通过让所有数据流共用同一个连接，可以更有效地使用 TCP 连接，让高带宽也能真正的服务于 HTTP 的性能提升。
* 发送http的一些方法   
    * GET、POST、HEAD、PUT、DELETE、OPTIONS、TRACE、CONNECT，这些是RFC2616标准（现行的HTTP/1.1）（HTTP的1.0版本中只有三种请求方法： GET, POST 和 HEAD方法）
    * GET方法要求服务器将URL定位的资源放在响应报文的数据部分，回送给客户端，问号（“?”）代表URL的结尾与请求参数的开始，传递参数长度受限制，用&（与运算符）隔开不同请求参数的键值对
    * POST方法将请求参数封装在HTTP请求数据中，以名称/值的形式出现，主要是提交请求/提交数据给服务器
    * HEAD就像GET，只不过服务端接受到HEAD请求后只返回响应头，而不会发送响应内容。当我们只需要查看某个页面的状态的时候，使用HEAD是非常高效的，因为在传输的过程中省去了页面内容。一般用于验证URI是否有效。
    * PUT和POST极为相似，都是向服务器发送数据，但它们之间有一个重要区别，PUT通常指定了资源的存放位置，而POST则没有，POST的数据存放位置由服务器自己决定。
    举个例子：如一个用于提交博文的URL，/addBlog。如果用PUT，则提交的URL会是像这样的”/addBlog/abc123”，其中abc123就是这个博文的地址。而如果用POST，则这个地址会在提交后由服务器告知客户端。目前大部分博客都是这样的。显然，PUT和POST用途是不一样的。具体用哪个还取决于当前的业务场景。
    * DELETE：删除某一个资源
    * OPTIONS这个方法很有趣，但极少使用。它用于获取当前URL所支持的方法。若请求成功，则它会在HTTP头中包含一个名为“Allow”的头，值是所支持的方法，如“GET, POST”。
    * TRACE回显服务器收到的请求，主要用于测试或诊断。
    * CONNECT的作用就是将服务器作为代理，让服务器代替用户去访问其他网页（说白了，就是翻墙），之后将数据返回给用户。
* http传递的是明文，信息不安全。所以有了https协议。其实就是在应用层和传输层之间增加一层安全层。https是用来身份认证和加密豹纹的协议。主要过程就是两方交换信息的放过中方协商好加密方式。客户端利用服务端的数字证书来判断其身份的安全性，两者最后都得到一个会话密钥来达到加密报文的目的。
    * TLS/SSL全称安全传输层协议Transport Layer Security, 是介于TCP和HTTP之间的一层安全协议，不影响原有的TCP协议和HTTP协议，所以使用HTTPS基本上不需要对HTTP页面进行太多的改造。
    * TLS/SSL工作原理
        * HTTPS协议的主要功能基本都依赖于TLS/SSL协议，TLS/SSL的功能实现主要依赖于三类基本算法：散列函数 Hash、对称加密和非对称加密，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。
            * 散列函数Hash
常见的有 MD5、SHA1、SHA256，该类函数特点是函数单向不可逆、对输入非常敏感、输出长度固定，针对数据的任何修改都会改变散列函数的结果，用于防止信息篡改并验证数据的完整性;
在信息传输过程中，散列函数不能单独实现信息防篡改，因为明文传输，中间人可以修改信息之后重新计算信息摘要，因此需要对传输的信息以及信息摘要进行加密;
            * 对称加密
常见的有AES-CBC、DES、3DES、AES-GCM等，相同的密钥可以用于信息的加密和解密，掌握密钥才能获取信息，能够防止信息窃听 （多对多）
            * 非对称加密
即常见的 RSA 算法，还包括 ECC、DH 等算法，算法特点是，密钥成对出现，一般称为公钥(公开)和私钥(保密)，公钥加密的信息只能私钥解开，私钥加密的信息只能公钥解开。（一对多）



>http 中如果想要使用缓存需要设置哪些字段
缓存分为强缓存和协商缓存。
* 强缓存主要是采用响应头中的``` Cache-Control 和 Expires ```两个字段进行控制的。
其中 Expires 是 HTTP1.0 中定义的，它指定了一个绝对的过期时期。而 Cache-Control 是 HTTP1.1 时出现的缓存控制字段。 由于 Expires 是 HTTP1.0 时代的产物，因此设计之初就存在着一些缺陷，如果本地时间和服务器时间相差太大，就会导致缓存错乱。
```这两个字段同时使用的时候 Cache-Control 的优先级会更高一点。```
* 协商缓存机制下，浏览器需要向服务器去询问缓存的相关信息，进而判断是重新发起请求还是从本地获取缓存的资源。如果服务端提示缓存资源未改动（ Not Modified ），资源会被重定向到浏览器缓存，这种情况下网络请求对应的状态码是 304。
     * 基于资源在服务器修改时间而验证缓存的过期机制
当客户端再次请求该资源的时候，会在其请求头上附带上 ```If-Modified-Since ```字段（值就是第一次获取请求资源时响应头中返回的 ```Last-Modified ```值）。如果修改时间未改变则表明资源未过期，命中缓存，服务器就直接返回 304 状态码，客户端直接使用本地的资源。否则，服务器重新发送响应资源，从而保证资源的有效性。
    * Etag 和 If-None-Match
        * 当客户端再次请求该资源的时候，会在其请求头上附带上 If-None-Match 字段（值就是第一次获取请求资源时响应头中返回的 Etag 值），其值与服务器端资源文件的验证码进行对比，如果匹配成功直接返回 304 状态码，从浏览器本地缓存取资源文件。如果不匹配，服务器会把新的验证码放在请求头的 Etag 字段中，并且以 200 状态码返回资源。
```需要注意的是当响应头中同时存在 Etag 和 Last-Modified 的时候，会先对 Etag 进行比对，随后才是 Last-Modified。```
- 当强缓存和协商缓存字段同时存在时会进行以下步骤来请求资源：
强缓存和协商缓存同时存在，如果强缓存还在有效期内则直接使用缓存；如果强缓存不在有效期，协商缓存生效。 即：```强缓存优先级 > 协商缓存优先级```
强缓存的 expires 和 cache-control 同时存在时， cache-control 会覆盖 expires 的效果， expires 无论有没有过期，都无效。 即： ```cache-control 优先级 > expires 优先级。```
协商缓存的 Etag 和 Last-Modified 同时存在时， Etag 会覆盖 Last-Modified的效果。即： ```ETag 优先级 > Last-Modified 优先级```。

>IPV4 的地址有多少位？多少个字节？IPV6 的呢

目前的互联网协议主流的是版本v4，即IPv4，下一代的IP是版本6的，称为IPv6。
* IPv4是在实验中产生的，没有考虑到太多的比如说安全问题，地址不够用等等这些问题。因为分类浪费了非常多的IP地址，加上网络飞速的发展，在2011年2月份，总的地址池已经完全的枯竭了。
* 因为IPv4地址不够用，所以人们使用了私人地址，私人地址不具有唯一性，它跟互联网进行通讯的时候必须要进行转换。**这个转换是用NAT转换器来完成的**。
* 和IPv4一样IPv6主要包括地址和分组
* IPv4的地址为32位，提供的地址数量是2的32次方，而IPv6的地址是128个二进制位表示的

> OSI 模型了解吗？每一层你能想到哪些协议？
* 物理层：
    * 直接为数据链路层服务
    * 主要功能：提供透明的比特流传输
注意：封装好的数据以“0、1”比特流的形式进行传递，从一个地方搬到另一个地方。物理层上的传输，从不关心比特流里面携带的信息，只关心比特流的正确搬运。
* 数据链路层
    * 保证数据传输的有效、可靠
    * 数据链路层处理的协议数据单元PDU是数据帧
        * 帧 = 帧头 + 载荷 + 帧尾
            * 载荷：从上层网络层送下来的分组或者包。
            * 帧头：有定位所需要的地址 物理地址信息
            * 帧尾：主要是校验核
    * 物理层为数据链路层提供服务
        * 物理层：位流（bit）
        * 数据链路层： 帧（frame）
    * 成帧： 将原始的位流分散到离散的帧中。
        * 成帧的方法
            * 字符计数法
                发送方：在每个帧头部中的第一个字段，表示该帧的长度，总共有多少字符集
                接收方：通过第一个字段，就知道这个帧有几个字符，在哪里结束该帧。
                字符计数法优点 ： 简单
                缺点：一旦出错，无法恢复，极少使用（比如读帧头中帧的长度读错时，就会导致后面全部读错）
            * 字节填充的标志字节法
                * 考虑了重新同步问题，每一帧采用一个特殊的字节做帧界，即帧的开始和结束  
                * 转义符号
    * 滑动窗口协议：
        * 滑窗协议可以批量收发数据，提高了信道利用率
        * 发送窗口对应着已经发送但还未被确认的帧
            * 滑动条件：收到了帧的确认
        * 接收串口对应着期待接收的帧
            * 滑动条件；收到了期待接收的帧
    * 回退N帧
        * 定义序列号seq的取值范围和滑动窗口W
        * 发送方连续发送至发送窗口满  
        * 接收窗口为1，对出错帧不确认（引发超时）
        * ```发送方超时重传，从未被确认帧开始```
    * 选择性重传
        * 接收方收到非期望的正确帧-缓存
        * 超时，发送方选择帧seq2重传
        * 接收方收到重传帧seq2-排序上交
* 网络层
    * 网络层的目的是实现两个主机系统之间的数据透明传送
    * 网络层负责对子网间的数据包进行路由选择
    *  基本数据单位为IP数据报
    * 包含的主要协议
        * IP协议
        * ICMP协议
        * ARP协议 地址解析协议 IP-MAC
        * RARP协议  逆地址解析协议 MAC-IP
    * 重要的设备——路由器
    * ICMP协议（Internet Control Message Protocol）是Internet控制消息协议，用于在IP主机、路由器之间传递控制消息。这些控制消息虽然不是用户数据，但是，对于保证用户数据的正确传输有着重要的作用。 ICMP封装在IP报进行传输。ICMP报文本身被封装在IP数据报的数据区中，而这个IP数据报又被封装在帧数据中。在IP数据报报头中的协议（Protocol）字段设置成1，表示该数据是ICMP报文。
    * 路由分为静态路由和动态路由
        * 静态路由
            指的是管理员手工配置的路由。
            * 好处是可以避免错误的丢包，也能够缩减路由表的规模，还能减少路由器的运行负担。
        * 动态路由
            * 由路由选择协议动态地建立、更新和维护的路由。
        * 路由选择协议分为两大类
            * 距离矢量路由选择（Distance Vector 简称DV）
                * 每一个路由器维护两个向量Di和Si分别表示从该路由器到所有其他路由器的距离及相应的下一跳
                * 在邻居路由器之间交换路由信息就是交换这个矢量信息，向量信息
                * 每个路由器根据收到的向量信息更新自己的路由表
                    * 路由信息协议RIP
                        * 典型的DV路由选择协议
                            * 采用了跳数作为量度，当量度超过15跳的时候，目标网络被认为不可达
                            * 默认的情况下，每30秒钟，就是半分钟交换一次向量信息
            * 链路状态路由选择（Link State 简称LS）     
                * LS的主要思想
                    * 发现：它的邻居们，了解他们的网络地址
                    * 设置：到它的每个邻居的成本度量
                    * 构造：一个分组LSP，包含它所了解到的上述所有信息
                    * 发送：这个分组给所有其他的路由器
                    * 计算：基于完整的网络（拓扑）图，计算到每个目标的最短路径
* 传输层
    * 在这一层，信息传送的协议数据单元称为段或报文
    * 作用：为应用进程之间提供端到端的逻辑通信
    * 协议： TCP UDP协议
        * TCP UDP协议两者的不同
            * TCP 是面向连接的，UDP 是面向无连接的
            * TCP 是面向字节流的，UDP 是基于数据报的
            * TCP 保证数据正确性，UDP 可能丢包
            * TCP 保证数据顺序，UDP 不保证
* 会话层
    * 会话层管理主机之间的会话进程，即负责建立、管理、终止进程之间的会话。会话层还利用在数据中插入校验点来实现数据的同步。
* 表示层
    * 表示层对上层数据或信息进行变换以保证一个主机应用层信息可以被另一个主机的应用程序理解。表示层的数据转换包括数据的加密、压缩、格式转换等。
* 应用层
    * 为用户的应用程序提供网络服务的接口。将用户的操作通过应用程序转换成为服务，并匹配一个相应的服务协议发送给传输层。


>GET 和 POST 请求有什么区别
* 提交方式
    * GET提交：请求的数据会附在URL之后, POST提交：把提交的数据放置在是HTTP包的包体＜request-body＞中
* 传输数据的大小
    *  GET:特定浏览器和服务器对URL长度有限制
    * POST:由于不是通过URL传值，理论上数据不受限
* 安全性
    * POST的安全性要比GET的安全性高
* 编码
    * get方式只能支持ASCII字符，向服务器传的中文字符可能会乱码。
    * post支持标准字符集，可以正确传递中文字符


>浏览器的 cookie 和服务端的 session 有什么区别
* 都是记录用户状态的机制
* Cookie数据存放在客户的浏览器上，Session数据放在服务器上。
* Cookie不是很安全，别人可以分析存放在本地的Cookie并进行Cookie欺骗，考虑到安全应当使用Session。
* Session会在一定时间内保存在服务器的内存中。当访问增多，会比较占用你服务器的性能。考虑到减轻服务器性能方面，应当使用Cookie。
* 单个Cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个Cookie。将登陆信息等重要信息存放为Session，其他信息如果需要保留，可以放在Cookie中
* 域的支持范围不一样，比方说a.com的Cookie在a.com下都能用，而www.a.com的Session在api.a.com下都不能用，解决这个问题的办法是JSONP或者跨域资源共享。
* 生命周期(以20分钟为例)
(1)cookie的生命周期是累计的，从创建时，就开始计时，20分钟后，cookie生命周期结束，
(2)session的生命周期是间隔的，从创建时，开始计时如在20分钟，没有访问session，那么session生命周期被销毁。但是，如果在20分钟内（如在第19分钟时）访问过session，那么，将重新计算session的生命周期
关闭浏览器并不会删除Session。在浏览器端可以调用相应的失效函数使Session失效


> 怎么实现多个网站之间共享登陆状态

单点登录 —— SSO
* 网络上对应不同场景的成熟SSO解决方案比比皆是，开源的有OpenSSO、CAS ，微软的AD SSO，及基于kerberos 的SSO等等
* 单点登录是一种控制多个相关但彼此独立的系统的访问权限, 拥有这一权限的用户可以使用单一的ID和密码访问某个或多个系统从而避免使用不同的用户名或密码，或者通过某种配置无缝地登录每个系统    
    * 我们只要买一次通票，就可以玩所有游乐场内的设施，而不需要在过山车或者摩天轮那里重新买一次票。在这里，买票就相当于登录认证，游乐场就相当于使用一套 SSO 的公司，各种游乐设施就相当于公司的各个产品。
* SSO，它的核心就是这3个元素了：```1. 用户，2. 系统，3. 验证中心```
    * SSO 仅仅是一种架构，一种设计，而 CAS 则是实现 SSO 的一种手段。两者是抽象与具体的关系。当然，除了 CAS 之外，实现 SSO 还有其他手段，比如简单的 cookie。
    * SSO 的演进与分类
        * 同域 SSO
            * 用户访问产品 a，向 后台服务器发送登录请求。登录认证成功，服务器把用户的登录信息写入 session。服务器为该用户生成一个 cookie，并加入到 response header 中，随着请求返回而写入浏览器。该 cookie 的域设定为 dxy.cn。下一次，当用户访问同域名的产品 b 时，由于 a 和 b 在同一域名下，也是 dxy.cn，浏览器会自动带上之前的 cookie。此时后台服务器就可以通过该 cookie 来验证登录状态了。
        * 同父域 SSO
            * 同父域 SSO 是同域 SSO 的简单升级，唯一的不同在于，服务器在返回 cookie 的时候，要把cookie 的 domain 设置为其父域。比如两个产品的地址分别为 a.dxy.cn 和 b.dxy.cn，那么 cookie 的域设置为 dxy.cn 即可。在访问 a 和 b 时，这个 cookie 都能发送到服务器，本质上和同域 SSO 没有区别。
        * 跨域 SSO
            * 当两个产品不同域时，cookie 无法共享，所以我们必须设置独立的 SSO 服务器了。这个时候，我们就是通过```标准的 CAS 方案来实现 SSO 的。```或者用```jsonp和跨域资源共享(cors)```
    * CAS
        * CAS 1.0 协议定义了一组术语，一组票据，一组接口。术语：
            * Client：用户。Server：中心服务器，也是 SSO 中负责单点登录的服务器。Service：需要使用单点登录的各个服务，相当于上文中的产品 a/b。接口：/login：登录接口，用于登录到中心服务器。/logout：登出接口，用于从中心服务器登出。/validate：用于验证用户是否登录中心服务器。/serviceValidate：用于让各个 service 验证用户是否登录中心服务器。票据
            * TGT：Ticket Grangting Ticket TGT 是 CAS 为用户签发的```登录票据```，拥有了 TGT，用户就可以```证明自己在 CAS 成功登录过```。TGT 封装了 Cookie 值以及此 Cookie 值对应的用户信息。当 HTTP 请求到来时，CAS 以此 Cookie 值（TGC）为 key 查询缓存中有无 TGT ，如果有的话，则相信用户已登录过。TGC：Ticket Granting CookieCAS Server 生成TGT放入自己的 Session 中，而 TGC 就是这个 Session 的唯一标识（SessionId），以 Cookie 形式放到浏览器端，是 CAS Server 用来明确用户身份的凭证。
            * ST：Service Ticket ST 是``` CAS 为用户签发的访问某一 service 的票据```。用户访问 service 时，service 发现用户没有 ST，则要求用户去 CAS 获取 ST。用户向 CAS 发出获取 ST 的请求，CAS 发现用户有 TGT，则签发一个 ST，返回给用户。用户拿着 ST 去访问 service，service 拿 ST 去 CAS 验证，验证通过后，允许用户访问资源。
* SSO 的 详细步骤
    * 用户访问产品 a，域名是 www.a.cn。
    * 由于用户```没有携带在 a 服务器上登录的 a cookie```，所以 a 服务器返回 http 重定向，重定向的 url 是 SSO 服务器的地址，同时 url 的 query 中通过```参数```指明登录成功后，回跳到 a 页面。重定向的url 形如 sso.dxy.cn/login?service=https%3A%2F%2Fwww.a.cn。
    * 由于用户没有携带在 SSO 服务器上登录的 TGC（看上面，票据之一），所以 SSO 服务器判断用户未登录，给用户显示统一登录界面。用户在 SSO 的页面上进行登录操作。
    * 登录成功后，SSO 服务器构建用户在 SSO 登录的 TGT（又一个票据），同时返回一个 http 重定向。这里注意：
        * 重定向地址为之前写在 query 里的 a 页面。
        * 重定向地址的 query 中包含 sso 服务器派发的 ST。
        * 重定向的 ```http response 中包含写 cookie 的 header```。这个 cookie 代表用户在 SSO 中的登录状态，它的值就是 TGC。
    * 浏览器重定向到产品 a。此时重定向的 url 中```携带着 SSO 服务器生成的 ST```。
    * 根据 ST，```a 服务器向 SSO 服务器发送请求```，SSO 服务器验证票据的有效性。验证成功后，a 服务器知道用户已经在 sso 登录了，于是 a 服务器```构建用户登录 session```，记为 a session。并将 cookie 写入浏览器。注意，此处的 cookie 和 session 保存的是用户在 a 服务器的登录状态，和 CAS 无关。
    * 之后用户访问产品 b，域名是 www.b.cn。
    * 由于用户没有携带在 b 服务器上登录的 b cookie，所以 b 服务器返回 http 重定向，重定向的 url 是 SSO 服务器的地址，去询问用户在 SSO 中的登录状态。
    * 浏览器重定向到 SSO。注意，第 4 步中已经向浏览器写入了```携带 TGC 的cookie```，所以此时 SSO 服务器可以拿到，根据 TGC 去查找 TGT，如果找到，就判断用户已经在 sso 登录过了。
    SSO 服务器返回一个重定向，重定向携带 ST。注意，这里的 ST 和第4步中的 ST 是不一样的，事实上，每次生成的 ST 都是不一样的。
    * ```浏览器带 ST 重定向到 b 服务器```，和第 5 步一样。
    * b 服务器根据票据向 SSO 服务器发送请求，票据验证通过后，b 服务器知道用户已经在 sso 登录了，于是```生成 b session```，向浏览器写入 b cookie。

> DNS 解析过程

* 第一步：浏览器将会检查缓存中有没有这个域名对应的解析过的IP地址，如果有该解析过程将会结束。浏览器缓存域名也是有限制的，包括缓存的时间、大小，可以通过TTL属性来设置。
* 第二步：如果用户的浏览器中缓存中没有，操作系统会先检查自己本地的hosts文件是否有这个网址映射关系，如果有，就先调用这个IP地址映射，完成域名解析。
* 第三步：如果hosts里没有这个域名的映射，则查找本地DNS解析器缓存，是否有这个网址映射关系，如果有，直接返回，完成域名解析。
* 第四步：如果hosts与本地DNS解析器缓存都没有相应的网址映射关系，首先会找TCP/ip参数中设置的首选DNS服务器，在此我们叫它本地DNS服务器，此服务器收到查询时，如果要查询的域名，包含在本地配置区域资源中，则返回解析结果给客户机，完成域名解析，此解析具有权威性。
* 第五步：如果要查询的域名，不由本地DNS服务器区域解析，但该服务器已缓存了此网址映射关系，则调用这个IP地址映射，完成域名解析，此解析不具有权威性。
* 第六步：如果本地DNS服务器本地区域文件与缓存解析都失效，则根据本地DNS服务器的设置（是否设置转发器）进行查询，如果未用转发模式，本地DNS就把请求发至13台根DNS，根DNS服务器收到请求后会判断这个域名(.com)是谁来授权管理，并会返回一个负责该顶级域名服务器的一个IP。本地DNS服务器收到IP信息后，将会联系负责.com域的这台服务器。这台负责.com域的服务器收到请求后，如果自己无法解析，它就会找一个管理.com域的下一级DNS服务器地址给本地DNS服务器。当本地DNS服务器收到这个地址后，就会找域名域服务器，重复上面的动作，进行查询，直至找到域名对应的主机。
* 第七步：如果用的是转发模式，此DNS服务器就会把请求转发至上一级DNS服务器，由上一级服务器进行解析，上一级服务器如果不能解析，或找根DNS或把转请求转至上上级，以此循环。不管是本地DNS服务器用是是转发，还是根提示，最后都是把结果返回给本地DNS服务器，由此DNS服务器再返回给客户机。




—————————————————————————————————————正在补充




> 交换机和路由器有什么区别

> 从广东一个站点访问上海的站点是怎么一个过程


> 什么是子网掩码

> ARP 协议是什么



> 分类地址？？？

> 什么是NAT技术？

> 幂等？？？

> 会不会讲到各种校验



> 我觉得 这么说前面的话 会引出 REST 机制。。。。。

> 服务端如果告诉客户端可以使用缓存会返回什么状态码？服务端错误又是什么状态码？如果是服务端代理问题的又是什么状态码？




> DNS 的工作原理了解吗

> 从浏览器输入 ‘qq.com’ 到看到这个页面整个过程是怎样的？追问：如果是本地的页面又是怎样的

> 浏览器的回流和重绘了解吗（介绍完我就顺便讲了怎么减少回流和重绘）


操作系统里面的进程和线程有什么区别？进程之间怎么通信？（坦然承认操作系统这块学得不好）
一个完整的数据库查找的语法是怎样的呢
什么是数据库的索引？什么时候需要用到索引
基本的算法还记得吗
快排是怎样实现的
什么是二叉树
怎么去算一个图的最短路径？比如 Dijkstra 算法，知道是怎么实现的吗
对称加密和非对称加密有哪些区别？又有哪些应用
常见的 web 攻击方式有哪些？他们具体是怎么攻击的
sql 注入怎么防范？XSS 怎么防范？CSRF 又怎么防范



数据结构中的栈、队列有什么区别

数组和链表有什么区别？双向链表有什么好处

虚拟内存了解吗

缓冲区溢出有了解吗

如何实现两个标签页的数据交互

如何删除一个 cookie

websocket 如何传输文件

怎么去分析项目的性能

chrome 调试用过哪些

页面卡顿的话可以做哪些优化

项目构建 package.json 有哪些项

项目升级版本发布需要做哪些工作（我说了一大堆乱七八糟的之后还是没说到他们想听的，最后给我介绍了一个灰度测试）

项目重构需要从那几方面出发

代码开发有哪些规范

其它的就是一些项目上的扯皮

最后让我做了三道 js 题目

手写一个对象深度拷贝的函数
一道关于变量声明提升的问题
if('a' in window) {
    var a = 'hello'
}
console.log(a)			// 输出?  
一道this指向的问题，并扩展了严格模式下会有什么不同
var name = 'window';
var person = {
    name: 'person',
    prop: {
        name: 'prop',
        say: function () {
            console.log(this.name)
        }
    }
}
person.prop.say()		// 输出?	
var fn = person.prop.say;
fn()					// 输出?	
———————————————————————————————————————————————


#### 数据结构
##### 排序算法
##### 二叉树
##### 图
##### 搜索策略
* 二分法

#### 操作系统



首先就是自我介绍
然后问react生命周期，异步请求一般在哪个生命周期，immutable一般用在哪个生命周期
diff算法，ABC三个节点要是顺序变了，会怎么样
虚拟dom
redux的工作流程
发送异步请求怎么办（中间件，然后问具体过程，问中间件原理，看过源码没）
HOC相关知识
fiber介绍一下
hooks了解吗
react和vue区别
然后又扯了一些混合开发，跨平台开发，flutter了解多少
然后让用flex弹性盒子实现骰子五点的布局
又问了些ES6特性（具体有点忘了，就是暂时性死区啊，promise啥的，根据回答会加深问下）
问性能优化，定位错误，调试方面，好像是问一个页面开始能正常显示，然后越来越卡越来越慢，怎么定位哪个有问题
然后问了HTTPS具体过程
中间还有其他一些，，不太记得了。
大多数还是在问框架吧。  


跨域


<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">


ES6的新特性 ？？！！html5的新特性 ！！！ css3的新特性？？！！


模版编译？？？？？


如何判断 JavaScript 数据类型？

js不精确：
要解决这个问题一般有两种方案，一种是用将数字转化为字符串来进行计算，另一种是将所有小数转化为整数进行计算后再将计算结果转化为对应的小数。我们主要采取第一种解决方案。


手写一个definepropertity


优雅的架构设计（中间件、路由、Artisan 命令行、代码迁移、假数据填充），再加上精心设计接口带来的愉悦编码体验
laravel比较优雅，约定高于配置
Laravel 作者在命名上有强迫症，上次在一个采访他的播客中他提到，基本上在开发一个新功能的时候，命名会花掉他三分之一的时间。

promise唯一接口then方法，它需要2个参数，分别是resolveHandler和rejectedHandler。并且返回一个promise对象来支持链式调用。
promise的构造函数接受一个函数参数,参数形式是固定的异步任务

要实现promise对象，首先要考虑几个问题：
1.promise构造函数中要实现异步对象状态和回调函数的剥离，并且分离之后能够还能使回调函数正常执行
2.如何实现链式调用并且管理状态

```js
// 实现一个promise
function Promise(executor){ //executor执行器
    let self = this;
    self.status = 'pending'; //等待态
    self.value  = undefined; // 表示当前成功的值
    self.reason = undefined; // 表示是失败的值
    function resolve(value){ // 成功的方法
        if(self.status === 'pending'){
            self.status = 'resolved';
            self.value = value;
        }
    }
    function reject(reason){ //失败的方法
        if(self.status === 'pending'){
            self.status = 'rejected';
            self.reason = reason;
        }
    }
    executor(resolve,reject);
}

Promise.prototype.then = function(onFufiled,onRejected){
    let self = this;
    if(self.status === 'resolved'){
        onFufiled(self.value);
    }
    if(self.status === 'rejected'){
        onRejected(self.reason);
    }
}
module.exports = Promise;
```

### pwa
http://www.cnblogs.com/pqjwyn/p/9016901.html