// 如果存在 timeout
timeoutPromise = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(
      new Response(
        'Timeout',
        {
          status: 408,
          statusText: "Fetch timeout",
          ok: false
        }
      )
    );
  }, timeout = 5000);
});

Promise.race([timeoutPromise(), fetch(url, opts)])
  .then(res => res.json())
  .then(data => {
    return data;
  });

// 一个延时1秒的异步函数
var resolveAfter1Second = function() {
  console.log("starting fast promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("fast");
      console.log("fast promise is done");
    }, 1000);
  });
};

// 一个延时2秒的异步函数
var resolveAfter2Seconds = function() {
  console.log("starting slow promise");
  return new Promise(resolve => {
    setTimeout(function() {
      resolve("slow");
      console.log("slow promise is done");
    }, 2000);
  });
};

// 顺序执行异步函数
var sequentialStart = async function() {
  console.log('==SEQUENTIAL START==');

  // 1. Execution gets here almost instantly
  const slow = await resolveAfter2Seconds();
  console.log(slow); // 2. this runs 2 seconds after 1.

  const fast = await resolveAfter1Second();
  console.log(fast); // 3. this runs 3 seconds after 1.
}

// 一起执行异步函数
var concurrentStart = async function() {
  console.log('==CONCURRENT START with await==');
  const slow = resolveAfter2Seconds(); // starts timer immediately
  const fast = resolveAfter1Second(); // starts timer immediately

  // 1. Execution gets here almost instantly
  console.log(await slow); // 2. this runs 2 seconds after 1.
  console.log(await fast); // 3. this runs 2 seconds after 1., immediately after 2., since fast is already resolved
}

function whoFast() {
  setTimeout(() => console.log('settimeout'), 0);
  new Promise(() => {
    console.log('promise');
  })
}