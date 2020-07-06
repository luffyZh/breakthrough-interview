/**
 * 实现原理就是将想要调用的函数放到对应的上下文对象里
 * 执行完后再把上下文对象的函数删除掉就行了
 */
Function.prototype._call = function (thisContext) {
  console.log(arguments, 333);
  // 调用 call 的 this 必须是函数，不是函数是不行的
  if (typeof this !== 'function') {
    throw Error('No Function Error: The call function context must be a functioon.');
  }
  // 如果未指定上下文，则默认指向 window
  thisContext = thisContext || window;
  // 将想要调用函数对象，也就是 this 添加到上下文对象中
  thisContext.fn = this;
  // 接下来就是把参数传入到函数 fn 里执行，得到结果
  var result = thisContext.fn(...Array.from(arguments).slice(1)); // 参数是除去第一个对象之后的参数扩展
  // 这一步很重要，必须把绑定的 fn 删除了，这样才是跟看起来一样
  delete thisContext.fn; 
  // 返回结果
  return result;
}