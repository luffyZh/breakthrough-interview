const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/cors/list', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');
  const list = [
    {
      name: 'luffy',
      age: 20,
      email: 'luffy@163.com' 
    }, {
      name: 'naruto',
      age: 24,
      email: 'naruto@qq.com'
    }
  ]
  res.status(200).json(list);
});

app.get('/jsonp/list', (req, res) => {
  const list = [
    {
      name: 'luffy',
      age: 20,
      email: 'luffy@163.com' 
    }, {
      name: 'naruto',
      age: 24,
      email: 'naruto@qq.com'
    }
  ]
  const resData = `callbackData(${JSON.stringify(list)})`;
  res.send(resData);
});

app.listen(3000, () => console.log('Project ready on http://localhost:3000/'));