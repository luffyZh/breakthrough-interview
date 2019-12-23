# [秃破前端面试] —— 前端跨域总结

## 前言

年前年后跳槽季，准备从面试内容入手看看前端相关知识点，旨在探究一个系列知识点，能力范围之内的深入探究一下。重在实践，针对初级前端和准备面试的同学，争取附上实际的代码例子以及相关试题～系列名字就用【秃破前端面试】—— 因为圈内大家共识，技术与发量成正比。😄希望大家早日 **秃** 破瓶颈～

> 关于面试题或者某个知识点的文章太多了，这里笔者只是想把个人的总结用代码仓库的形式记录下来并输出文章，毕竟理论不等于实践，知其然也要知其所以然，实践用过才能真正理解～

相关系列同类型文章：
 - [秃破前端面试 —— HTTP && HTTPS](https://juejin.im/editor/posts/5dea2504f265da33b201ba0b)
 - [秃破前端面试 —— Web安全相关](https://juejin.im/editor/postss/5df60580518825121f699cd6)
 - [秃破前端面试 —— 跨域实践总结](https://juejin.im/editor/posts/5df3afa76fb9a016266456a7)
 - [秃破系列更多地址](https://github.com/luffyZh/breakthrough-interview)
 

## 什么是跨域

今天这篇我们来好好讲讲跨域实践～为什么要加上实践，因为跨域这东西，相信大家理论上看得足够多了，如果作为面试来说，可能说出来几个方案就够了，面试官也不会让实际写代码，但是你真的使用过吗？你真的了解其中的实现原理吗？基于此观点，写了如下这篇实践为主的跨域文章。

具体来讲，看上面的文章《Web安全相关》应该大体了解了。如果没了解，在这里就再简要概述一下。

在前端页面请求 url 地址的时候,该 url 与浏览器上的 url 地址必须处于同域上，也就是域名、端口以及协议三者相同。如果其中任何一个不同，就属于跨域范畴。

直接代码截图来看更为直观：

```
// express 起了一个小型服务，并且写了一个接口 /list
app.get('/list', (req, res) => {
  const list = [
    {
      name: 'luffy',
      age: 20,
      email: 'luffy@163.com' 
    }, {
      name: 'naruto',
      age: 24,
      email: 'naruto@qq.com'
    }
  ]
  res.status(200).json(list);
});
```
浏览器访问一下：

![](https://user-gold-cdn.xitu.io/2019/12/20/16f210313b2053e5?w=543&h=349&f=png&s=24183)

再写一个html页面调用这个接口：
```
<script>
  window.onload = function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/list');
    xhr.onreadystatechange = function () { 
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resData = JSON.parse(xhr.responseText);
        console.log(resData);
      }
    };
    xhr.send();
  }
</script>
```

![](https://user-gold-cdn.xitu.io/2019/12/20/16f2116880c56aa7?w=1503&h=534&f=png&s=57416)

可以看到，这就是跨域，相信刚学前端又不太懂后台的小伙伴经常会见到。

> **跨域**：简而言之，我们通常所说的跨域就是指在浏览器同源策略的限制下，浏览器不允许执行其他网站的脚本。

## 解决跨域的方式

解决跨域的方式多种多样，不过其实说白了，我们平时用到的也就那么两三种，但是既然是总结，我们就把各种奇淫技巧都整理一下～

> 个人觉得，在团队项目开发过程中，前端并不是很适合做跨域处理，大部分场景跨域都应该是由后端处理的，所以这里也只是简单讨论这个跨域方案的发展历程。

### 最流行的跨域解决方案 —— CORS

当下项目中如果涉及到跨域，实际上都应该是后端通过设置 CORS 来解决的。CORS 是目前最主流的跨域解决方案，跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的Web应用被准许访问来自不同源服务器上的指定的资源。 

```
// 在node端设置一下请求头，允许接收所有源地址的请求
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', '*');
```
重启服务，刷新一下页面：

![](https://user-gold-cdn.xitu.io/2019/12/20/16f21f39ed2803de?w=933&h=441&f=png&s=48917)

可以看到，获取到了数据，跨域解决完成～

> 一般来说简单点，Node.js 可以直接使用社区成熟的 [cors](https://www.npmjs.com/package/cors) 方案

### 最经典的跨域解决方案 —— JSONP

接下来要说的就是 JSONP 解决方案，说它最经典一点都不为过，虽然现在大部分项目并不会使用它来解决跨域，但是只要是面试，涉及到跨域，基本都会问到这个知识点。

#### 原理，非同源限制的标签

同源限制是跨域的本质，也就是没有同源限制这么个东西，那么也就不存在跨域了。事实上，存在一些标签没有同源限制 —— `<script>/<link>/<img>`。JSONP 利用的原理就是这些标签来解决跨域的问题。

#### 第一步：假设后台有一个接口 `/jsonp/list`
```
// 按钮获取数据
<button onclick="loadJsonpData()">JSONP获取数据</button>

<script>
  function loadJsonpData() {
    const script = document.createElement('script');
    script.src='http://localhost:3000/jsonp/list';
    document.body.appendChild(script);
  }
</script>
```
点击按钮，就会向`<body>`标签内部插入一个`<script>`标签，浏览器遇到`<script>`就会执行里面的内容。**关键点，浏览器会执行脚本里面的内容。**

#### 第二步：前后端约定好执行函数的名称

第一步提到过了，把指定的 url 通过`<script>`标签加载到页面里，会执行脚本里面的内容。那么想一下我们跨域请求的目的 —— **获取数据**。也就是说，里面的内容应该是个可执行函数，并且把我们想要的数据传递过来。因此，现在前后端需要约定一个执行函数的名称！

假设这边约定该函数名称为`callbackData`

#### 第三步：前端定义callbackData

约定好了执行函数名称，前端就得定义它，因为后台返回的是一段可执行代码，如果前端没定义，就会报`callbackData undefined`的错误。

```
// 定义 callback 函数，获取后台的 data
function callbackData(data) {
    console.log(data, 98989);
}
```

#### 第四步：后台返回携带数据的可执行代码

前后端约定好了名称，并且前端定义好了函数，参数是想要拿到的数据，后台只需要把数据包在执行函数里响应回去就可以了。

> 注意，JSONP 的接口不同于正常接口，它返回的不是 json 格式的数据，而是一段可执行字符串，这个字符串会被前端执行。

```
app.get('/jsonp/list', (req, res) => {
  const list = [
    {
      name: 'luffy',
      age: 20,
      email: 'luffy@163.com' 
    }, {
      name: 'naruto',
      age: 24,
      email: 'naruto@qq.com'
    }
  ]
  // 把数据塞进执行函数里面
  const resData = `callbackData(${JSON.stringify(list)})`;
  res.send(resData); // 这里不能使用res.json而是res.send
});
```
我们来执行一下看看:

![](https://user-gold-cdn.xitu.io/2019/12/20/16f2240e4fb7e8a7?w=1082&h=587&f=gif&s=117115)

可以看到，点击按钮，浏览器 Network JS 会请求新插入的`<script>`的地址，该地址响应的内容是事先定义好的`callbackData(resData)`

![](https://user-gold-cdn.xitu.io/2019/12/20/16f224329ca271a5?w=1115&h=310&f=png&s=26097)

而在前端，因为定义了`callbackData(data)`，所以控制台可以看到，打印了后台响应过来的内容。

上面就是 jsonp 的基本过程，不知道给大家解释没解释清楚，其实真的很简单，只不过以前在看的时候感觉所有人讲的都很官方，并没有实际操作，让很多人会误解或者看不懂，这里我就通过实际代码来讲解，相信会很容易理解～

事实上，jsonp 还可以进行封装，然后可以实现的很漂亮～哈哈。比如`jquery`就内置支持 jsonp。
```
// jquery jsonp
$.ajax({
	url: "http://cross-domain/get_data",
	dataType: "jsonp"， // 指定服务器返回的数据类型
	jsonp: "callback", // 指定参数名称
	jsonpCallback: "callbackName" // 指定回调函数
}).done(function(resp_data) {
	console.log("Ajax Done!");
});
```
这里我就不封装了，因为懂得原理就行了，现在的前端应该很少使用了，只用来面试了。

> 另外，虽然我经常使用的是`<script>`标签，但是其实`<img>`标签也是可以的。

### 最简单的跨域解决方案 —— NGINX

这个就不多做介绍了，说实话，并不算前后端跨域解决方案，而是属于运维层级的，并且如果面试被问到跨域相关，面试官应想得到的应该也不是这个答案。

一个简易版 NGINX 解决跨域配置大概如下：
```
server
{
    listen 3003;
    server_name localhost;
    location /ok {
        proxy_pass http://localhost:3000;

        #   指定允许跨域的方法，*代表所有
        add_header Access-Control-Allow-Methods *;

        #   预检命令的缓存，如果不缓存每次会发送两次请求
        add_header Access-Control-Max-Age 3600;
        #   带cookie请求需要加上这个字段，并设置为true
        add_header Access-Control-Allow-Credentials true;

        #   表示允许这个域跨域调用（客户端发送请求的域名和端口） 
        #   $http_origin动态获取请求客户端请求的域   不用*的原因是带cookie的请求不支持*号
        add_header Access-Control-Allow-Origin $http_origin;

        #   表示请求头的字段 动态获取
        add_header Access-Control-Allow-Headers 
        $http_access_control_request_headers;

        #   OPTIONS预检命令，预检命令通过时才发送请求
        #   检查请求的类型是不是预检命令
        if ($request_method = OPTIONS){
            return 200;
        }
    }
}
```

### 理论上的跨域解决方案 —— window.name

说它是理论上的跨域解决方案也就是说它确实能实现跨域传递数据，但是却很少被应用。
查阅了一下，`MDN 是这么说的，（如 SessionVars 和 Dojo's dojox.io.windowName ，该属性也被用于作为 JSONP 的一个更安全的备选，来提供跨域通信（cross-domain messaging）`。但是这俩框架我也确实孤陋寡闻了，还是有应用的并且兼容性还是很好的，除了万年不变的 IE 不一定支持，其他的浏览器都支持。

![](https://user-gold-cdn.xitu.io/2019/12/21/16f26fa7bad9844a?w=2100&h=808&f=png&s=146499)

我们先来简单了解一下什么是`window.name`：

 - 每个浏览器窗口（Tab页）都有独立的window.name与之对应
 - 在一个窗口（Tab页）的从打开到关闭之前，窗口载入的**所有**页面同时共享一个`window.name`，该窗口下每个页面对`window.name`都有读写的权限。
 - `window.name`是当前窗口（Tab页）的属性，并不会因为页面跳转而发生改变。
 - `window.name`容量大概是2MB，存储格式为字符串

说起来略显苍白，还是来实际例子看看吧。


![](https://user-gold-cdn.xitu.io/2019/12/21/16f274ee44b2531a?w=1990&h=1072&f=gif&s=249776)

上图，在`http://127.0.0.1:3006`设置了`window.name = aaaaa`，之后页面跳转到了`http://127.0.0.1:3008`，根据浏览器同源策略，这是跨域
场景，而也正确拿到了上一个页面设置的`window.name`。上面提到了，每一个窗口共享，那么如果是不同端口呢？
```
// 代码改成新窗口打开
<a target='_blank' href='http://127.0.0.1:3008/'>跳转到3008端口</a>
```

![](https://user-gold-cdn.xitu.io/2019/12/21/16f2753baa56a828?w=1984&h=1158&f=gif&s=322536)

可以看到，`window.name`确实是窗口（Tab页）之间独立的，新窗口打开，`window.name`初始化是空字符串。

![](https://user-gold-cdn.xitu.io/2019/12/21/16f275701d230bb7?w=2142&h=894&f=png&s=99701)


![](https://user-gold-cdn.xitu.io/2019/12/21/16f27593bb413f80?w=2154&h=878&f=png&s=102818)

上面这两张图则是`window.name`的存储形式，设置了`Array a`和`Object b`，可见`window.name`在存储的时候会调用该对象自身的`toString()`之后再存储。

当然，如果面试官真的问到这里了，这么回答其实也没什么大问题，但是还是存在瑕疵的，因为存在特殊情况，就是 ES6 新增的基本类型`Symbol`。

![](https://user-gold-cdn.xitu.io/2019/12/21/16f275bcced1e196?w=1438&h=528&f=png&s=127555)

####  实际使用`window.name`进行跨域数据获取

上面说了那么多，其实都是简单的介绍`window.name`特性及使用方法，事实上，并没有涉及到跨域获取数据，比如说第一个 Demo，我在 A 设置 `window.name` 然后跳转到 B 能拿到 A 设置的值，这叫跨域吗？我跳转的时候把值加在参数上岂不是更方便，所以并不是实际场景。下面我们就来一个实际场景：

**【问题描述】**： 存在两个不同域页面 A 和 B，
通过 `window.name` 实现 A 加载的时候获取到 B 页面设置的 `window.name`。

先来思考一下，B 页面做的事情无非就是把数据设置在`window.name`里，那么我们加载 A 页面的时候去 B 页面获取，这个时候又不能先跳转到 B 然后再回到 A，因为获取数据是一个异步不刷新页面的场景。嗯，说到这差不多就知道了，肯定是得通过 iframe 来实现了，也就是 A 页面开一个同域的 iframe —— 假设是 proxy.html，我们称之为中转页，中转页内我们再打开 B 页面，获取 B 的`window.name`事先设置好的 data 即可。整个过程大致如下：

![](https://user-gold-cdn.xitu.io/2019/12/21/16f2795e9f3e8700?w=1912&h=1210&f=png&s=187757)

下面是代码部分：
```
http://127.0.0.1:3006/a-data.html -> A 页面
http://127.0.0.1:3006/a-data.html -> proxy 数据中转页面 -> 只是个空页面
http://127.0.0.1:3008/b-data.html -> B 页面
___________________________________________

// b-data.html
<script>
  const data = [
    {
      name: 'luffy',
      age: 20
    }, {
      name: 'naruto',
      age: 22
    }
  ]
  window.onload = function() {
    window.name = JSON.stringify(data);
  }
</script>

// a-data.html
<script>
  const currentDomain = 'http://127.0.0.1:3006'; // 当前域
  const corssDomain = 'http://127.0.0.1:3008'; // 跨域
  window.onload = function() {
    let flag = false; // 是否获取数据
    iframe = document.createElement('iframe'),
    loadData = ()=> {
      if (flag) {
        // 读取B的数据
        let data = iframe.contentWindow.name;    
        console.log(data, 66666);
        iframe.contentWindow.document.write('');
        iframe.contentWindow.close();
        document.body.removeChild(iframe);
      } else {
          flag = true;
          // 加载同域代理文件
          iframe.contentWindow.location = `${currentDomain}/proxy.html`; 
      }  
    };
    iframe.src = `${corssDomain}/b-data.html`;
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', loadData);
    } else {
      iframe.onload  = loadData;
    }
    document.body.appendChild(iframe);
  }
</script>
```
![](https://user-gold-cdn.xitu.io/2019/12/21/16f2798fea246939?w=2562&h=1072&f=png&s=138998)

从上图可以看到，A 获取到了 B 页面传递过来的数据，怎么说呢，太复杂了，需要增加一个 iframe 并且还需要一个中转页，所以 -> **综上所述，** 个人觉得，`window.name`确实是个理论解决方案，跨域必须依赖`window.name`的种种特性，但是必须是在浏览器同一窗口下进行，且需要配合`iframe`以及同域中转页。

#### 传说中的嫡系方案 HTML5 postMessage

这算是一个比较高级的方式了，为什么呢？因为前面的 JSONP 或者 `window.name`，是奇思妙想而来的，人家官方设计它并不是拿来进行跨域的或者说是钻了设计的漏洞，至于 CORS 和 NGINX 则是非前端范畴。所以 HTML5 出了这个 postMessage 专门用来正正经经做“安全”跨域的，亲儿子和捡来的儿子的区别能一样吗😂？但是也不知道为啥，我觉得可能这种方式使用的也比较少吧，或许我孤陋寡闻，但是确实没怎么看人用过。

**原理**： `otherWindow.postMessage(message, targetOrigin, [transfer]);`

postMessage 的原理是依赖于一个其他窗口的引用，而这个引用可以是`window.open()`返回的，也可以是一个 iframe 的 contentWindow，还可以是命名过后有索引的`window.frames`，所以可能在其他地方你也会看到 postMessage 和 iframe 在一起使用。

postMessage使用起来也是比较简单，并且[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)介绍的也是比较详细，感兴趣的可以仔细阅读阅读，我这里直接就实践上代码了：

```
// A页面

let opener;
function openB () {
    opener = window.open('http://127.0.0.1:3008/index.html')
}

// 发送消息
function postMsg() {
    const msg = document.getElementById('chatB').value;
    opener.postMessage(msg, "http:/127.0.0.1:3008");
}
```
A 页面的逻辑很简单，就是我们通过 A 页面使用`window.open()`打开 B，然后使用获取到的 targetWindow 进行两个页面间的通信。

```
// B 页面
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
    // Chrome浏览器兼容
    const origin = event.origin || event.originalEvent.origin; 
    if (origin !== "http://127.0.0.1:3006") {
      return;
    }
    const { data } = event; // 获取到 A 的数据
    // 下面是你的逻辑
    ...
}
```
在 B 页面，我们监听`message`事件，然后判断是否是目标域，如果是目标域，获取到数据进行操作。

> 这里强调一下为什么说安全，因为 A 与 B 进行通信之前，都会判断是否是否是目标域，如果不是是不会进行操作的，是前端开发者可控的状态。

我们来看一下效果：

![](https://user-gold-cdn.xitu.io/2019/12/21/16f283813925e09f?w=1872&h=1176&f=gif&s=366643)

只能用一句`哎呦，不错呦～`来形容了，既然已经完成了 A 跟 B 发消息，那么就送佛送到西，咱把 B 到 A 的也写完，也算是一个简易版聊天系统了。

![](https://user-gold-cdn.xitu.io/2019/12/21/16f284564612132f?w=2108&h=1130&f=gif&s=389115)

OK，看起来还是很不错的，毕竟官方方案，弄的很成熟，而且发送数据也可以是多种多样的格式，这应该是最先进的了。但是，原谅我，即使是写完了这个小 Demo，我也还是想象不到它的真实贴切的使用场景，局域网聊天？有可能，你如果跟我说实时通信，那我肯定是不信的，因为下面还会介绍更牛的大佬～如果有人用得多，或者真实场景使用过，可以留言交流下，让我涨涨见识😄

### 其他跨域解决方案

#### document.domain

这个就更没啥人用了，也只是存在于书本上或者文档里，因为场景比较局限限制比较大。他的限制倒是不多，但是限制性很大。想要使用这种方式实现跨域，A与B必须满足如下条件：
```
A: http://aaa.xxx.com:port
B: http://bbb.xxx.com:port
```
也就是，A 与 B 的一级域名相同，二级域名不同，并且协议和端口号也必须相同。 

在满足上述条件基础之上，两个页面彼此设置`window.domain = 'xxx.com'`，就可以进行通信了。。。原谅我穷B一个没有域名给大家展示了。但是说实话也没必要，这种方式何必呢。。。

#### WebScoket

好了，真正的大佬在这里，来了，上面再讲 postMessage 的时候，做了个 A 和 B 聊天的小 Demo，；也说到了，如果真的是聊天通讯场景，大佬级别的肯定是 Webscoket 啊。

**为啥 Websocket 能处理跨域？**

这个问题该怎么说呢。首先，把 Websocket 放在这里其实算是作弊了，为什么呢？因为我们所说的跨域是指，浏览器和服务端基于 HTTP 协议进行通信时出现同源限制了。而 Websocket 根本就不是基于 HTTP 协议的，它是位于 TCP/IP 上层，跟 HTTP 协议同层的浏览器通信协议。

![](https://user-gold-cdn.xitu.io/2019/12/21/16f286832532fcec?w=1204&h=926&f=png&s=47849)

> 现在写个文章太难了，还得会画画😂

它大概是上面这个样子的，Webscoket 与 HTTP 是同层协议，所以 HTTP 的限制对于 Webscoket 来说，人家根本不鸟你，同级关系，你凭啥管我～但是呢，还有个小箭头，是指 WebSocket 在建立握手连接时（TCP三次握手），数据是通过 HTTP 协议传输的，但是在建立连接之后，真正的数据传输阶段是不需要 HTTP 协议参与的。关于 Websocket 的这里就不涉及太多了，因为本文是说跨域的，既然上面写了个通讯，那么就拿 Websoket 同样写一个来看看区别，先上效果图（简单的客户端和服务端聊天）：

![](https://user-gold-cdn.xitu.io/2019/12/22/16f2bbf118b259fa?w=1864&h=1422&f=gif&s=204966)

可以看到，Websocket 的重要之处其实并不在于解决跨域，事实上应该也没人用它解决跨域。它的重要之处在于，它提供了客户端主动与服务端主动推送消息的能力。如果是使用 HTTP，我们一般都只是，客户端发起一个请求，服务端响应这个请求，没办法做到彼此主动推送消息，因此，如果不使用 Websocket 的时候，一般都是通过一个 AJAX 长轮训，设置定时器不断的去发送请求更新数据，这样做其实浪费性能并且也不是很优雅。所以 Websocket 概括起来的优点就是：

 - 没有同源限制，不跨域
 - 全双工通信，双端都能主动推送消息
 - 实时性更好，灵活性更高

Websocket 的适用场景也就是那些实时性很高的应用，比如通讯类，股票基金类，基于位类等应用。

> 笔者了解的并不是很多，更多相关信息请查阅官方文档以及其他相关文章。

## 相关题目

#### 1. 什么是跨域，为什么会跨域

#### 2. 说说解决跨域的几种方式

#### 3. 说说 JSONP 的实现原理及过程

## 总结

虽然上面罗列了那么多跨域解决方案，但实际上还是 CORS 和 JSONP 这两种是最常用的，并且面试中也经常被深问。

那么对比一下 CORS 和 JSONP：

| | CORS | JSONP |
| - | - | - |
| 优点 | 比较简便，既支持 post 又支持 get | 利用的原生标签特性，兼容性特别好 |
| 缺点 | 低版本IE不兼容 | 只支持 get 方式，并且需要前后端约定 |

写到这里跨域相关的实践总结基本上是写完了，好累啊，因为除了原理还要想场景写代码，确实不容易，希望能对大家有所帮助吧～

[代码地址👇这里](https://github.com/luffyZh/breakthrough-interview)

如果觉得还不错，点个 star 和赞不胜感激。

