process.on('uncaughtException', (e) => {
  console.log('捕获到了异常');
  console.log(e);
});

function errorFunc() {
  throw new Error('Catch Error');
}

errorFunc();

function testFunc() {
  setTimeout(() => {
    throw new Error('Async Error');
  }, 100);
}

testFunc();