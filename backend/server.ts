const express = require('express')
const cors = require('cors');
const users = require('./data/users')
const app = express()
const port = 5000

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/users', (req, res) => {
    res.json(users)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
