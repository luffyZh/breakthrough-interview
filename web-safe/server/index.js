const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/hello', (req, res) => {
  const { name } = req.query;
  res.send(`<h1>Hello, ${name}</h1>`);
});

app.post('/comment', (req, res) => {
  console.log(req.body);
  fs.writeFile(
    path.resolve(__dirname, './db.txt'),
    `${req.body.comment}\n`,
    { flag: 'a', encoding: 'utf-8' },
    (err) => {
      if (err) console.log(err);
      res.status(200).json({
        message: 'success'
      });
    });
})

app.get('/comment', async (req, res) => {
  const comment = await fs.readFileSync(path.resolve(__dirname, './db.txt'), 'utf-8');
  let commentDom = '';
  comment.split('\n').filter(c => c.length !== 0)
    .forEach(item => commentDom += `<p>${item}</p>`);
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>XSS - 持久存储型</title>
      <style>
        .container {
          padding: 10px;
          border: 1px solid #e2e2e2;
        }
      </style>
    </head>
    <body>
      <h1>
        我是文章
      </h1>
      <div class='container'>
        <h2>文章评论：</h2>
        ${commentDom}
      </div>
    </body>
    </html>
  `);
})

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