const express = require('express');
const app = express();

/**
 * socket
 */
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', conn => {
  
  conn.on('message', data => {
    data === 'Let us start chat'
      ? conn.send('土豆土豆，我是地瓜，咱俩可以开始聊天了')
      : conn.send('土豆土豆，我是地瓜，我收到了你的消息：' + data.split('：')[1]);
  });
  conn.on('disconnect', () => {
    console.log('关闭连接');
  });
});
server.listen(3002);