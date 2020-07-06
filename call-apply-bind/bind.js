/**
 * bind 的实现可以通过 call 和 apply 来实现
 * 因为上面已经实现了 call 和 apply
 * 但是稍微要比上面复杂一些，因为它不是执行，而是返回了一个可执行函数
 */
Function.prototype._bind = function(thisContext) {
   // 调用 bind 的 this 必须是函数，不是函数是不行的
   if (typeof this !== 'function') {
    throw Error('No Function Error: The bind function context must be a functioon.');
  }
  // 暂存 this，ES5 常用伎俩，要不然 this 会乱
  var self = this;
  var args = [];
  for (var i = 1; i < args.length; i++) {
    args.push(arguments[i]);
  }
  // 设定返回的函数
  bindFunc = function() { 
    // this instanceof bindFunc === true 时，说明返回的 bindFunc 被当做 new 的构造函数调用
    // 返回的是个可执行函数，执行的时候再使用 apply 进行实现。
    return self.apply(this instanceof bindFunc ? this : thisContext, args.concat([].slice.call(arguments)));
  }
  /**
   * 下面是为了维持原型关系
   */
  var func = function(){};
  if(this.prototype) {
    func.prototype = this.prototype;
  }
  // bindFunc.prototype 是 func 的实例，返回的 bindFunc 若作为 new 的构造函数，新对象的 __proto__ 就是func的实例
  bindFunc.prototype = new func();
  return bindFunc;
}
