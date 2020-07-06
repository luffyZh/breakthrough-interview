const cluster = require('cluster');

// 判断是不是主进程
if (cluster.isMaster) {
  const cpus = require('os').cpus().length;
  for (let i = 0; i < cpus; i++) {
    // 使用 cluster 的 fork 模式创建与CPU个数相同的子进程
    cluster.fork();
  }

  // 创建进程完成后输出信息
  cluster.on('online', (worker) => {
    console.log('Create worker: pid = ' + worker.process.pid);
  });

  // 监听子进程退出后重启事件
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Master] worker: ${worker.process.pid} died with code: ${code} and ${signal}`);
    // 又一个子进程关闭就新启动一个，等同于重启过程
    cluster.fork();
  });
} else {
  /**
   * 如果不是主进程，表示子进程逻辑
   */
  const net = require('net');
  // 创建一个服务监听 8686 端口，子进程都监听该端口
  net.createServer().on('connection', (socket) => {
    setTimeout(() => {
      // 请求被哪个子进程处理了
      socket.end('Request handled by worker: pid = ' + process.pid);
    }, 10)
  }).listen(8686)
}