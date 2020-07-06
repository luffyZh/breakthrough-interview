const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/home', function (req, res, next) {
  const err = new Error('BROKEN') // Express will catch this on its own.
  next(err)
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))