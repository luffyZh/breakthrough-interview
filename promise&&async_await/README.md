## 前言

年前年后跳槽季，准备从面试内容入手看看前端相关知识点，旨在探究一个系列知识点，能力范围之内的深入探究一下。重在实践，针对初级前端和准备面试的同学，争取附上实际的代码例子以及相关试题～系列名字就用【秃破前端面试】—— 因为圈内大家共识，技术与发量成正比。😄希望大家早日 **秃** 破瓶颈～

> 关于面试题或者某个知识点的文章太多了，这里笔者只是想把个人的总结用代码仓库的形式记录下来并输出文章，毕竟理论不等于实践，知其然也要知其所以然，实践用过才能真正理解～

相关系列文章：
 - [秃破前端面试 —— Promise && Async/Await](https://juejin.im/editor/posts/5df3af45e51d45583317efa3)
 - 秃破前端面试 —— 原型与继承 - 还没写
 - 秃破前端面试 —— 闭包 - 还没写

## Promise

### Promise 背景

凡事有因必有果，新事物的出现就代表着老的事物不能满足我们的需求了。Promise 这个新事物就是在这个背景下出现的，而它代替的老事物就是ES6 之前经常被用的 callback（回调函数）。

> 虽然 ES6 Promise 已经并不能算是新事物了，但是就背景来说，它刚出现的时候确实是来解决异步回调地狱问题的。

#### 回调地狱

什么是回调地狱，来看一个最简单的示例：

```js
setTimeout(() => {
    console.log(111);
    setTimeout(() => {
      console.log(222);
      setTimeout(() => {
        console.log(333);
        setTimeout(() => {
          console.log(444);
          // 你还可以放置更多
          ...
        }, 4000);
      }, 3000);
    }, 2000)
  }, 1000);
```
一般来说回调地狱就是出现在异步操作中，下一次的操作依赖上一次的结果，一环套一环，套着套着就套的我们头痛难忍，写出了上面的代码。

当然，上面有点为了黑而黑了，事实上，经常使用的场景应该是 AJAX 请求以及数据库的各种操作会产生回调地狱。下面代码就是一个标准的数据库查多次表的一个操作（这里我只查了两次，但是也已经形成了嵌套）。

```js
 /**
   * 回调地狱示例
   */
  const db = Object.create(null); // 假设这就是连接数据库的对象
  /**
   * 第一步，从 A 表查出 id 为 1 的用户
   * 第二步，从 B 表查出文章作者是 id = 1 用户 username 的所有文章
   **/
  db.query('SELECT * FROM A WHERE id = 1', function(err, results) {
    if (err) throw err;
    // 完成第一步，开始第二步
    db.query(`SELECT * FROM B WHERE author = ${results[0].username}`, function(err, results) {
      if (err) throw err;
      // 完成第二步，开始干坏事
      console.log(results);
    });
  });
```
上面代码，如果再继续查下去，一定跟上面的代码差不太多，而数据库查询也确实可能会出现上面的情况。

#### Promise 解决异步避免回调地狱

出现问题了，就得解决啊，Promise 就出现了，先来看看 Promise 怎么解决回调地狱的。

```js
 // promise 解决
  function f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(111), 1000);
    }).then(data => console.log(data));
  }
  function f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(222), 2000);
    }).then(data => console.log(data));;
  }
  function f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(333), 3000);
    }).then(data => console.log(data));;
  }
  function f4() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(444), 4000);
    }).then(data => console.log(data));;
  }
  f1().then(f2).then(f3).then(f4);
```
嗯，这么一看，确实是解决了，并没有函数嵌套，然后调用也变成了链式调用。当然，这个例子也有点特殊，反过来看看数据库查询数据的例子：

```js
/**
* 使用 Promise
* 因为 Promise 是 ES6，所以下面所有代码都使用 ES6 语法
**/
new Promise((resolve, reject) => {
    db.query('SELECT * FROM A WHERE id = 1', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
}).then(data => {
    // 拿到第一步数据，开始第二步
    db.query(`SELECT * FROM B WHERE author = ${results[0].username}`, (err, results) => {
      if (err) reject(err);
      // 完成第二步，开始干坏事
      console.log(results);
    }); 
}).catch(err => {
    throw err;
});
```
相比之下，看起来确实要好看一些。

### Promise 基础

Promise 对象用于表示一个异步操作的最终完成 (或失败)，及其结果值。Promise 对象是一个代理对象（代理一个值），被代理的值在 Promise 对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的 promise 对象。

> 它的出现是为了解决 ES6 之前 JS 代码中频繁嵌套回调函数所导致的回调地狱问题，Promise 为 ES6 特性。

### Promise 状态

一个 Promise 对象值是未知的，状态是可变的，但是无论怎么变化，它的状态永远处于以下三种之间： 

- pending：初始状态，既不是成功，也不是失败。
- fulfilled：意味着操作成功完成。
- rejected：意味着操作失败。

Promise 的状态会发生变化，成功时会从`pending -> fulfilled`，失败时会从`pending -> rejected`，但是此过程是不可逆的，也就是不能从另外两个状态变成`pending`。`fulfilled/rejected`这两个状态也被称为 settled 状态。

### Promise使用

JS 万物皆对象，所以 Promise 也可以被我们`new`出来。我们通过下面的语法来新建一个 Promise 对象：
```
new Promise( function(resolve, reject) {...} /* executor */  );
```
Promise 的构造函数有一个参数 —— 是一个带有两个参数`(resolve, reject)`的函数，这两个参数分别代表此次异步操作的结果也就是Promise的状态。`resolve`和`reject`函数被调用时，分别会将此次 Promise 的状态改成`fulfilled`或者`rejected`，一旦异步操作结束，Promise 的最终状态只能是二者之一，如果异步成功，该状态会被`resolve`函数修改为`fullfilled`；相反当异步过程中抛出一个错误，那么该状态就会被`reject`函数改成`rejected`。

### Promise API

Promise 的原型链以及对象本身有一些方法供我们使用，其中最常用也比较有可说性的就是下面这几个：

#### then —— Promise.prototype.then(onFulfilled, onRejected)

> 添加解决(fulfillment)和拒绝(rejection)回调到当前 promise, 返回一个新的 promise, 将以回调的返回值来 resolve。

这么看起来总是晦涩难懂的，还是得实际代码来看：

```js
 new Promise((resolve, reject) => {
    setTimeout(() => resolve(111), 1000);
  }).then(data => {
    console.log(data);
  });

  new Promise((resolve, reject) => {
    setTimeout(() => reject(111), 1000);
  }).then(data => {
    console.log(data);
  });
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f6504c7aef2844?w=571&h=408&f=png&s=64477)

可以看到，`.then`里面拿到的是我们 Promise resolve 过后的数据。并且他还会返回一个 Promise 继续供我们调用，比如：

```
new Promise((resolve, reject) => {
    setTimeout(() => resolve(111), 1000);
  }).then(data => {
    console.log(data); // 打印 111
    return data + 111; // 相当于 resolve(data + 111)
  }).then(data => {
    console.log(data); // 打印 222
  });
```

`then()`用法比较简单，大家肯定也经常用，这里其实就知道`.then()`是可以一直链式调用的，因为它的返回值也是一个 Promise，就可以了。

#### catch -- Promise.prototype.catch(onRejected)

> 添加一个拒绝(rejection) 回调到当前 promise, 返回一个新的 promise。当这个回调函数被调用，新 promise 将以它的返回值来 resolve，否则如果当前 promise 进入 fulfilled 状态，则以当前 promise 的完成结果作为新 promise 的完成结果。

```
 new Promise((resolve, reject) => {
    setTimeout(() => reject(111), 1000);
  }).then(data => {
    console.log('then data:', data);
  }).catch(e => {
    console.log('catch e: ', e);
  });
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f650b23457470e?w=671&h=225&f=png&s=36696)

如上图所示：通常来说，一般写到 catch 就表示发生异常了，一般就结束了，但是从文档说明来看，它返回的也是一个 Promise，我表示并没有这么用过，但是还是实验一下吧：
```
 new Promise((resolve, reject) => {
    setTimeout(() => reject(111), 1000);
  }).then(data => {
    console.log('then data:', data);
  }).catch(e => {
    console.log('catch e: ', e);
    return e;
  }).then(data => {
    console.log('catch data: ', data);
  });
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f650e55d7bf259?w=664&h=290&f=png&s=46991)

好吧，涨姿势了，但是还是那句话，个人觉得  catch 到错误就可以了，没必要下一步了，除非你还要用错误做其他的事情～ 

#### all —— Promise.all(iterable)

> 这个方法返回一个新的 promise 对象，该 promise 对象在 iterable 参数对象里所有的 promise 对象都成功的时候才会触发成功，一旦有任何一个 iterable 里面的 promise 对象失败则立即触发该 promise 对象的失败。这个新的 promise 对象在触发成功状态以后，会把一个包含 iterable 里所有 promise 返回值的数组作为成功回调的返回值，顺序跟 iterable 的顺序保持一致；如果这个新的 promise 对象触发了失败状态，它会把 iterable 里第一个触发失败的 promise 对象的错误信息作为它的失败错误信息。Promise.all 方法常被用于处理多 个promise 对象的状态集合。

这个算是我经常使用的一个 API 了，上面的内容虽然有点长，但是总结起来其实也很简单，大概就是如下三个方面：

- 第一：接收一个 Promise 对象数组作为参数

```
  // promise 解决
  function f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(111), 1000);
    }).then(data => console.log(data));
  }
  function f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(222), 2000);
    }).then(data => console.log(data));;
  }
  function f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(333), 3000);
    }).then(data => console.log(data));;
  }

  Promise.all([f1, f2, f3]);
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f65193618fb220?w=670&h=358&f=png&s=69466)

- 第二：参数所有回调成功才是成功，返回值数组与参数顺序一致

```
  // promise 解决
  function f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(111), 1000);
    });
  }
  function f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(222), 2000);
    });;
  }
  function f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(333), 3000);
    });;
  }

  Promise.all([f1(), f2(), f3()]).then(results => {
    console.log(results);
  });
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f651b3a6692506?w=673&h=401&f=png&s=68002)

可以看到，返回值是一个数组，并且每个元素对应的就是参数数组里对应过后的resolve值。

- 第三：参数数组其中一个失败，则触发失败状态，第一个触发失败的 Promise 错误信息作为 Promise.all 的错误信息。

```
 // promise 解决
  function f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(111), 1000);
    });
  }
  function f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(222), 2000);
    });;
  }
  function f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(333), 3000);
    });;
  }

  Promise.all([f1(), f2(), f3()]).then(results => {
    console.log(results);
  }).catch(e => {
    console.log(e);
  });
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f651d743ab713c?w=658&h=431&f=png&s=61057)

可以看到，当我把第二个和第三个分别设置成 reject 的时候，Promise.all 进入了 catch 也就是捕获异常阶段，捕获到的是第二个 reject 内容，也就是第一次出现的 reject 的那个地方。

> 所以，一般来说，Promise.all 用来处理多个并发请求，也是为了页面数据构造的方便，将一个页面所用到的在不同接口的数据一起请求过来，不过，如果其中一个接口失败了，多个请求也就失败了，页面可能啥也出不来，这就看当前页面的耦合程度了～

#### race

> 当 iterable 参数里的任意一个子 promise 被成功或失败后，父 promise 马上也会用子 promise 的成功返回值或失败详情作为参数调用父 promise 绑定的相应句柄，并返回该 promise 对象。

这个 API 讲道理，不经常使用，但是在某些场景下，还是特别给力的。怎么说的，字面意义就是竞赛，想象一个场景，用户登录和取消，登录过程是一个请求过程，会耗时，假设我这边点击登录之后，数据请求过程中点击了取消，那么如果登录还未响应回来，应该就是取消这个行为赢得了竞争，就不登录了。

当然，登录取消这个场景我没有实际使用过，我只在一个地方用到过 Promise.race —— fetch timeout，众所周知，前端如果使用 fetch 请求的时候，没办法设置超时时间，因为 fetch 内部并没有 timeout 这个参数，那么如果我们希望前端可以设置超时时间，比如超过5s没有响应数据的话就认为请求超时了，这个时候可以使用 Promise.race 来帮助我们实现。因为 fetch 本质上也是 Promise，我们只需要在 Promise.race 里将 fetch 和一个 5s 延时过后 reject/resolve 的 Promise 进行竞赛即可。具体代码如下：

```
// fetch timeout实现
timeoutPromise = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(
      new Response(
        'Timeout',
        {
          status: 408,
          statusText: "Fetch timeout",
          ok: false
        }
      )
    );
  }, timeout = 5000);
});

Promise.race([timeoutPromise(), fetch(url, opts)])
  .then(res => res.json())
  .then(data => {
    return data;
  });
```

因为我比较喜欢用 fetch，所以恰好有这个场景的使用，亲测可用，具体细节内容大家可以根据自己的项目去修改，这里不过多介绍，感兴趣可以留言交流。

### 手写一个 Promise

讲到这里，一定会有人问了，是不是又要手写一个 Promise 了？**当然不会！** 我说过了，重在实践，从实践角度出发，我觉得并不会有人在项目里使用自己手写的 Promise 而是都直接 `new Promise()`，因此，我再去多此一举浪费自己和大家的时间去写一个并不会有人用的 Promise，也没什么意义，如果你们想了解内部实现，建议直接去看源码～

> [Promise 源码地址](https://chromium.googlesource.com/v8/v8/+/3.29.45/src/promise.js?autodive=0%2F)

## Async/Await

还得再来一遍，新事物的出现就代表着老的事物不能满足我们的需求，ES6 刚出 Promise 来解决异步问题，ES7 就又出了一个 Async/Await（其实官方名字是 async function），看来 Promise 并没有达到大家伙的预期，所以官方就又搞了个更为优雅的异步解决方案。

为什么说它是为了解决 Promise 带来的问题，可以看看 MDN 官网的下面这段话：

> async/await 的目的是简化使用多个 promise 时的同步行为，并对一组 Promises 执行某些操作。正如 Promises 类似于结构化回调，async/await 更像结合了 generators 和 promises。

#### Promise 并不是完美的解决方案

上面提到的那个异步嵌套 setTimeout的例子来说，事实上，大部分人用 Promise 应该并不会像上面的代码那样写，而是下面这样：

```
/* Async/Await */
 new Promise((resolve, reject) => {
    setTimeout(() => resolve(111), 1000);
  }).then(data => {
    console.log(data);
    new Promise((resolve, reject) => {
      setTimeout(() => resolve(222), 2000)
    }).then(data => {
      console.log(data);
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(333), 3000)
      }).then(data => {
        console.log(data);
        new Promise((resolve, reject) => {
          setTimeout(() => resolve(444), 4000)
        }).then(data => {
          console.log(data);
        })
      })
    })
  });
```
嗯，说实话，其实 Promise.then() 如果使用过多，依然还是回调地狱，嵌套依然没有消失，所以来说，Promise 并不能称之为完美的异步方案，因此，ES7 提出了 async function，它用来更为优雅的解决异步。我们这次就来看看它的魅力：

```
  // 定时器嵌套
  function f1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(111), 1000);
    }).then(data => console.log(data));
  }
  function f2() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(222), 2000);
    }).then(data => console.log(data));;
  }
  function f3() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(333), 3000);
    }).then(data => console.log(data));;
  }
  function f4() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(444), 4000);
    }).then(data => console.log(data));;
  }

  async function timeoutFn() {
    await f1(); // 开始执行第一个异步函数
    await f2(); // 第一个执行完，开始执行第二个异步函数
    await f3(); // 第二个执行完，开始执行第三个异步函数
    await f4(); // 第三个执行完，开始执行第四个异步函数
  }
  timeoutFn();
```
```
// 数据库查询
async function queryData() {
    try {
      // 第一步，获取数据
      const step1Data = await db.query('SELECT * FROM A WHERE id = 1');
      // 第二步，获取数据
      const step2Data = await db.query(`SELECT * FROM B WHERE author = ${step1Data[0].username}`);
      console.log(step2Data);
    } catch(e) {
      throw e;
    }
}
```
看看上面的代码，多么的优美，完全的同步流程～称之为最完美异步解决方案一点也不为过。

#### async function 基础

关于 async function，其实并没有过多的 API，因为它更像是一个高级语法糖，官方文档给出的也更多都是使用示例。在这里，其实我们只需要知道并强调一件事 —— **await 关键字用来暂停等待异步函数的执行结束，如果是 Promise，也就是等待它的 settled 状态，并且 await 只能出现在 async function 内部，不可单独使用**。

#### 示例

官方给出了一个比较有意思的例子：

```js
// 一个1秒的异步函数
var resolveAfter1Second = function() {
  console.log("starting fast promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("fast");
      console.log("fast promise is done");
    }, 1000);
  });
};

// 一个2秒的异步函数
var resolveAfter2Seconds = function() {
  console.log("starting slow promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("slow");
      console.log("slow promise is done");
    }, 2000);
  });
};

// 下面这种写法是一起执行异步函数，只不过因为await等待导致输出有先后
var concurrentStart = async function() {
  console.log('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds(); // starts timer immediately
  const fast = resolveAfter1Second(); // starts timer immediately

  // 1. Execution gets here almost instantly
  console.log(await slow); // 2. this runs 2 seconds after 1.
  console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}

// 下面这种是标准的等待写法
var sequentialStart = async function() {
  console.log('==SEQUENTIAL START==');

  // 1. Execution gets here almost instantly
  const slow = await resolveAfter2Seconds();
  console.log(slow); // 2. this runs 2 seconds after 1.

  const fast = await resolveAfter1Second();
  console.log(fast); // 3. this runs 3 seconds after 1.
}
```

![](https://user-gold-cdn.xitu.io/2020/1/2/16f6547da6dd451f?w=673&h=382&f=png&s=60318)

具体来说大家可以自己实际体验一下，第二种没什么可说的，想象中就是这个样子，因为 await 会暂停等待函数执行完之后再向下执行，因此等待时间不会重叠，先等待2秒执行 slow 后再等待1秒执行 fast。

而第一种

```js
const slow = resolveAfter2Seconds();
const fast = resolveAfter1Second();

console.log(await slow);
console.log(await fast);
```

上面这两个异步函数因为没有 await 关键字，都是立即执行，因此先输出`promise start`，之后，两个函数延时不同，虽然 slow 先执行，但是是2秒，而 fast 后执行是1秒，先输出`fast done`再输出`slow done`。最后，await 关键字发挥作用，虽然 fast 先执行完，但是你还是要等 await slow 完事之后才能 await fast。

## 总结

这里就不给相关面试题了，把背景和基础内容都了解了，API 都知道如何使用了，那么面试题也就百变不离其宗了，也没什么可说的了。写到此处忽然想起来一个问题，那么还是说一下吧。setTimeout 和 Promise 都是异步操作，那么谁更快呢？

```js
function whoFast() {
  setTimeout(() => console.log('settimeout'), 0);
  new Promise(() => {
    console.log('promise');
  })
}

```
![](https://user-gold-cdn.xitu.io/2020/1/2/16f655d63093396d?w=656&h=228&f=png&s=25959)

实践是检验真理的唯一标准，promise 无关顺序更快执行，至于原理，大家就去看 js 的 event loop 机制吧，如果感兴趣，后续也可以写～

[代码地址](https://github.com/luffyZh/breakthrough-interview)

## 参考文章

 - [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
 - [MDN async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)



