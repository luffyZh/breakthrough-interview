const childProcess = require('child_process');
const cpus = require('os').cpus().length;

console.log('CPU numbers: ', cpus);

const workers = [];

/**
 * 有几个 CPU 就创建几个自己成
 */
for (let i = 0; i < cpus; i++) {
  workers.push(childProcess.fork('./worker.js'));
  workers[i].send(`你好 ${workers[i].pid}, 我是你爸爸`);
  workers[i].on('message', msg => {
    console.log('[Master]: Received message from worker: ' + msg)
  });
};

console.log('Master: 我是主进程');