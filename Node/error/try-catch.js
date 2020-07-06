const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

/**
 * try catch 捕获异常
 */
try {
  throw new Error('error');
} catch(e) {
  console.log(e);
}

/**
 * 不能捕获异步异常
 */
try {
  setTimeout(() => {
    throw new Error('error');
  })
} catch (e) {
  console.log(e);
}


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});