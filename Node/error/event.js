const events = require('events');

// 创建一个事件监听对象
const emitter = new events.EventEmitter();

// 监听error事件
emitter.addListener('error', (e) => {
  // 处理异常信息
  console.log('捕获到异常');
  console.log(e);
});

// 触发 error 事件
emitter.emit('error', new Error('Code Error'))