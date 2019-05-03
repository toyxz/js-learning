关于正则 需要补充内容  但是现在一边学一边把知识放在图谱里面。暂时还没有整理其他东西。先把一些xmind里面无法整理的给整理出来


正则引擎在匹配的过程中，给每一个分组开辟一个空间，用来存储每一个分组匹配到的数据
```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( string.match(regex) );
// [ '2017-06-12','2017', '06','12',index: 0,input: '2017-06-12',groups: undefined ]

var regex = /\d{4}-\d{2}-\d{2}/;
var string = "2017-06-12";
console.log( string.match(regex) );
// [ '2017-06-12', index: 0, input: '2017-06-12', groups: undefined ]
```

利用$以及分组来替换符号
```js
var regex = /(\d{4})-(\d{2})-(\d{2})/;
  var string = "2017-06-12";
  var result = string.replace(regex, "$2/$3/$1");
  console.log(result);
  // => "06/12/2017"
```

字符串trim方法模拟
```js
// 第一种，匹配到开头和结尾的空白符，然后替换成空字符
 function trim(str) {
      return str.replace(/^\s+|\s+$/g, '');
  }
  console.log( trim("  foobar   ") );
  // => "foobar"
// 第二种，匹配整个字符串，然后用引用来提取出相应的数据
 function trim (str) {
      return str.replace(/^\s*(.*?)\s*$/g, "$1");
  }
  console.log( trim("  foobar   ") );
  // => "foobar"
  // 这里使用了惰性匹配 *?，不然也会匹配最后一个空格之前的所有空格的。
```
 将每个单词的首字母转换为大写
 ```js
  function titleize (str) {
      return str.toLowerCase().replace(/(?:^|\s)\w/g, function (c) {
          return c.toUpperCase();
      });
  }
  console.log( titleize('my name is epeli') );
  // => "My Name Is Epeli"
 ```
 驼峰化
 ```js
  function camelize (str) {
      return str.replace(/[-_\s]+(.)?/g, function (match, c) {
          console.log(match)
          return c ? c.toUpperCase() : '';
      });
  }
  console.log( camelize('-moz-transform') );
  // => "MozTransform"

// 其中分组 (.) 表示首字母。单词的界定是，前面的字符可以是多个连字符、下划线以及空白符。正则后面
// 的 ? 的目的，是为了应对 str 尾部的字符可能不是单词字符，比如 str 是 '-moz-transform '。
 ```
 中划线化
 ```js
 
  function dasherize (str) {
      return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
  }
  console.log( dasherize('MozTransform') );
  // => "-moz-transform"
 ```
HTML转义和反转义
```js
// 将HTML特殊字符转换成等值的实体 
function escapeHTML (str) {
      var escapeChars = {
        '<' : 'lt',
        '>' : 'gt',
        '"' : 'quot',
        '&' : 'amp',
        '\'' : '#39'
      };
      return str.replace(new RegExp('[' + Object.keys(escapeChars).join('') +']', 'g'),
        function (match) {
                return '&' + escapeChars[match] + ';';
            });
        }
      console.log( escapeHTML('<div>Blah blah blah</div>') );
  // => "&lt;div&gt;Blah blah blah&lt;/div&gt";
```
反转义
```js
 // 实体字符转换为等值的HTML。 function unescapeHTML (str) {
      var htmlEntities = {
        nbsp: ' ',
        lt: '<',
        gt: '>',
        quot: '"',
        amp: '&',
        apos: '\''
      };
      return str.replace(/\&([^;]+);/g, function (match, key) {
          if (key in htmlEntities) {
              return htmlEntities[key];
}
          return match;
      });
  }
  console.log( unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;') );
  // => "<div>Blah blah blah</div>"
```
匹配成对标签

要求匹配:
  ```<title>regular expression</title>```
  ```<p>laoyao bye bye</p>```

不匹配:
  ```<title>wrong!</p>```
  匹配一个开标签，可以使用正则 <[^>]+>， 匹配一个闭标签，可以使用 <\/[^>]+>，

```js
   var regex = /<([^>]+)>[\d\D]*<\/\1>/;
  var string1 = "<title>regular expression</title>";
  var string2 = "<p>laoyao bye bye</p>";
  var string3 = "<title>wrong!</p>";
  console.log( regex.test(string1) ); // true
  console.log( regex.test(string2) ); // true
  console.log( regex.test(string3) ); // false
```
其中开标签 <[\^>]+> 改成 <([^>]+)>，使用括号的目的是为了后面使用反向引用， 而提供分组。闭标签使用了反向引用，<\/\1>。
另外，[\d\D]的意思是，这个字符是数字或者不是数字，因此，也就是匹配任意字符的意思。


括号嵌套问题？？？？按照分组来


我发现浏览器和node中对RegExp的$获取某个位置的符号 有点不一样。。。
