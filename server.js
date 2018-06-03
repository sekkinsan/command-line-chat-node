const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:e24b9a0a-3a90-48ae-8692-7328aabc7d5a',
  key:
    '8238f76c-9f59-40fd-a7c3-0a49fbedf8af:06aIkrsIXqoqyKqXQ1ohiyZHnUj+7y0ZqEjsbJo6I50='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User created: ${username}`)
      res.sendStatus(201)
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`)
        res.sendStatus(200)
      } else {
        res.status(err.status).json(err)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const port = 3001
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Running on port ${port}`)
  }
})