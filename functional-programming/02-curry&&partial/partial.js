const partial = (fn, ...particalArgs) => {
  // 转换成另一个数组
  let args = particalArgs;
  // 记录占位符的位置
  const keyPositions = args.reduce((acc, cur, index) => {
    cur === undefined ? acc.push(index) : null;
    return acc;
  }, []);
  // 返回函数，该函数也接受一串参数
  return (...fullArgs) => {
    let arg = 0;
    // 每次调用之前重置占位符为 undefined
    for (let i = 0; i < keyPositions.length; i++) {
      args[keyPositions[i]] = undefined;
    }
    // 遍历两个参数列表，如果外部函数参数列表遇到了 undefined，此时将内部函数参数列表逐次赋值给外部函数参数列表。undefined 的意义表示，从 undefined 开始要把内部函数的参数也赋值给 args 参数列表
    for (let i = 0; i < args.length && arg < fullArgs.length; i++) {
      if (args[i] === undefined) {
        args[i] = fullArgs[arg++];
      }
    }
    return fn.apply(null, args);
  }
}

const add4 = (a, b, c, d) => {
  return a + b + c + d;
}

const _add4 = partial(add4, 10, undefined, 30, undefined);
_add4(20, 40);