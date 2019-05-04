### DNS的基本原理

#### DNS的一些关键术语
* 根域名服务器

负责返回顶级域名服务器的地址

全球共有13个根域名服务器，共504个域名服务器（NameServer，NS）。在DNS查询过程中，```由路由层面（BGP）寻找到具体承担解析任务的NS进行就近解析。根域名服务器存放了顶级域的NS列表。```
* 顶级域名服务器

通常指的是.com(商业机构) .net(网络提供商)  .edu(教育机构)  .cn(中国域名)，负责返回权威域名服务器的地址。同样，全球共有13台.com的顶级域名服务器(或者其他)
* 权威域名服务器

一般指的是能够控制```最终IP地址解析能力的一组服务器```。
* LocalDNS

用户上网时IPS会给用户分配一个Local DNS，这个Local DNS解析请求给```最终的权威DNS```。它具有cache的能力。```如果在TTL的时间内有cache，就不会向根域、顶级域、权威域 发送DNS查询请求```

* DMS no glue

在顶级域名授权中心注册一个新的域名时，需要提供权威(NS)的列表，通常是一组域名。如果只是提供域名、没有提供IP地址的方式称为 no glue。

* DNS TTL
TTL（Time To Live）表示一条域名解析记录在DNS上缓存的时间。

#### DNS查询过程（14个步骤）
* 终端用户的浏览器发起DNS请求，发送ISP提供给用户非DNS服务器（相当于由代理的DNS解析服务器迭代权威服务器返回的应答，最后将最终的IP地址返回给客户端浏览器）
* ISP的DNS服务器收到域名解析请求，将域名解析请求发送给其选定的跟域名服务器（总共13个，由于根域名的13个地址几乎不发生变化，所以在Local DNS的软件配置文件里内置了13个域名）
* 根域名服务器收到域名解析请求，发现是.com顶级域名的请求，于是将.com顶级域名服务器列表和ip地址返回给local DNS
* Local DNS根据一定的策略选定.com的一个NS，并且将www.xxx.com的域名查询请求发给这个NS
* 选定的.com的NS接收到www.aaa.com的域名查询请求，请把它这里注册和登记的aaa.com的NS列表和IP地址返回给Local DNS
* Local DNS根据一定的策略选定aaa.com的一个NS，并且将www.aaa.com的域名查询请求发送给这个NS
* 选定的aaa.com的NS接收到www.aaa.com的域名查询请求后，将www.aaa.com的别名www.aaa.com.lxdns.com返回给Local DNS(下面的任务就是解析这个域名)（通常用于将网站性能要求委托给CSN提供商进行解析）
* 要解析www.aaa.com.lxdns.com仍然要有完整的迭代过程，把解析请求发给根域名服务器，然后Local DNS在本地的服务器列表缓存中选择一个顶级域名服务器，并将请求发送给该服务器。
* 选定的.com的NS接收到www.aaa.com.lxdns.com的域名查询请求后，将NS列表和IP地址返回给lxdns.com
* 将www.aaa.com.lxdns.com的域名解析请求发送给Local DNS选定的NS
* lxdns.com的NS接受到www.aaa.com.lxdns.com的域名解析请求后，将别名aaa.xdwscache.glb0.lxdns.com返回给Local DNS CNAME
* 要解析aaa.xdwscache.glb0.lxdns.com，则由于之前访问过.lxdns.com,故直接使用缓存，并将该域名请求发送给选定的一个.lxdns.com的域名解析服务器
* 选定的.lxdns.com的域名解析服务器接受到域名解析请求后，将A地址返回给Local DNS
* Local DNS将收到的A地址返回给客户端，并且将其保存在高速缓存中。






>参考《大型网站性能优化实战》
