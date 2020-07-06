const process = require('process');

process.on('message', (msg) => {
  console.log('[Worker]: Received message from master: ' + msg);
});

process.send(`你好爸爸，儿子的名字是: ${process.pid}`);