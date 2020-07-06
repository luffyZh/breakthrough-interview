(function () {
  function sayHello() {
    console.log('Module2 say Hello');
  }
  window.Module2 = {
    sayHello
  }
})();