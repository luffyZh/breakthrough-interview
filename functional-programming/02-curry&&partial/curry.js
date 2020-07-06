/**
 * 一个最简单的柯里化
 */
const add = (a, b) => a + b;
const firstCurryAdd = a => b => a + b;
// 执行
add(2, 3); // 5
firstCurryAdd(2)(3); // 5

/**
 * 简易版实现柯里化
 */
const currySimple = fn = x => y => fn(x, y);
const curryAdd2 = currySimple(add);
curryAdd2(2)(3); // 5 

/**
 * 完整版柯里化
 */
const curry = fn => {
  // 首先，柯里化接收的参数必须是一个函数，因为做的是函数柯里化操作
  if (typeof fn !== 'function') {
    throw Error('No function provided');
  }
  // 这里返回的函数不能是匿名函数，因为函数内部可能还会继续进行参数柯里化操作，所以要给个名字
  return function curryInnerFn(...args) {
    /**
     * 这里有两个地方需要注意
     * 第一个： 如果当前调用的函数接收到的参数小于原函数参数，那么进行参数柯里化操作，小于表示还不能执行函数返回结果
     * 第二个：可以通过 fn.length 获取一个函数的参数列表长度，等价于函数内部的 arguments.length
     */
    if (args.length < fn.length) {
      // 因为还要继续进行柯里化操作，所以还要返回一个函数
  		return function() {
        // 这里返回的是一个匿名函数，必须是 ES5 形式，因为下面合并参数要使用 arguments，箭头函数没有 arguments
        return curryInnerFn.apply(null, args.concat(
          /**
           * 这里面是最核心的部分
           * 第一：如果参数小于原函数 fn 的参数，返回柯里化函数之后说明后续还会继续接受参数
           * 第二：返回的是递归调用的内部函数（闭包），在调用的时候要把第一次接收到的参数 (args) 与后面接收到的参数 (匿名函数的)arguments 依次拼接起来，这样才和原函数参数个数与顺序一致
           * 第三：arguments 是类数组对象，要转化成数组
           */
          [].slice.call(arguments)
        ));
      }
    }
    // 如果柯里化函数接收的参数个数和原函数接收参数个数一致（或大于原函数），执行原函数返回结果
  	return fn.apply(null, args);
  }
}