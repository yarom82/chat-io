const bodyParser = require('body-parser')
const express = require('express')
const redis = require('redis')
const fs = require('fs')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http);

let creds = ''
let client = ''
const port = process.env.PORT || 8080

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

// Start the chat.io server
http.listen(port, function () {
  console.log('Server started. Listening on port: ' + port)
})

let users = []
let messages = []
let usersSockets = []
let sockets_by_id = {}

fs.readFile('creds.json', 'utf-8', function (err, data) {
  if (err) throw err
  creds = JSON.parse(data)
  client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port)

  client.once('ready', function () {
    console.log('redis ready')
    client.get('users', function (err, reply) {
      console.log('getting users from redis...')
      if (reply) {
        console.log('got reply from users redis')
        users = JSON.parse(reply)
      }
    })
  })

  client.get('messages', function (err, reply) {
    console.log('getting messages from redis...')
    if (reply) {
      console.log('got reply from messages redis')
      messages = JSON.parse(reply)
    }
  })
})

app.get('/', function (req, res) {
  console.log('/')
  res.sendFile('dist/index.html', {
    root: __dirname
  })
  console.log('dist/index.html')
})

app.get('/index.bundle.js', function (req, res) {
  console.log('/index.bundle.js')
  res.sendFile('dist/index.bundle.js', {
    root: __dirname
  })
  console.log('dist/index.bundle.js')
})

app.get('/main.bundle.js', function (req, res) {
  console.log('/main.bundle.js')
  res.sendFile('dist/main.bundle.js', {
    root: __dirname
  })
  console.log('dist/main.bundle.js')
})

app.post('/join', function (req, res) {
  console.log('** join **')
  const username = req.body.username
  if (users.indexOf(username) === -1) {
    users.push(username)
    client.set('users', JSON.stringify(users))
    res.send({
      'users': users,
      'status': 'OK'
    })
  } else {
    res.send({
      'status': 'FAILED'
    })
  }
})

app.post('/leave', function (req, res) {
  console.log('** leave **')
  const username = req.body.username
  users.splice(users.indexOf(username), 1)
  client.set('users', JSON.stringify(users))
  res.send({
    'status': 'OK'
  })
})

app.post('/send_message', function (req, res) {
  console.log('** send_message **')
  const username = req.body.username
  const message = req.body.message
  messages.push({
    'sender': username,
    'message': message
  })
  client.set('messages', JSON.stringify(messages))
  res.send({
    'status': 'OK'
  })
})

app.get('/get_messages', function (req, res) {
  console.log('** get_messages **')
  res.send(messages)
})

app.get('/get_users', function (req, res) {
  console.log('** get_users **')
  res.send(users)
})

io.sockets.on('connection', function (socket) {
  console.log('** connection ** ' + socket.id)

  socket.on('message', function (data) {
    console.log('** message **')
    io.emit('send', data)
  })

  socket.on('update_users_count', function (data) {
    console.log('** update_users_count **')
    if (data.action == 'increase') {
      client.hget('users:' + data.username, 'socketid', function (err, reply) {
        if (reply) {
          client.hdel('users:' + data.username, 'socketid')
        }
        client.hset('users:' + data.username, 'socketid', socket.id)
        // Workaround: Can't get Socket by it's id since Socket.IO 1.4
        sockets_by_id[socket.id] = socket
      })
    } else {
      client.hdel('users:' + data.username, 'socketid')
      sockets_by_id[socket.id] = null
    }

    io.emit('count_users', data)
  })

  socket.on("private", function (data) {
    console.log('** private **')
    client.hget('users:' + data.to, 'socketid', function (err, sessionId) {
      // Workaround: Can't get Socket by it's id sincce Socket.IO 1.4
      const toSession = sockets_by_id[sessionId]
      if (toSession) {
        toSession.emit("send_private_message", data);
      }
      // io.to('/#' + reply).emit - doens't work anymore
    })
  });
})
