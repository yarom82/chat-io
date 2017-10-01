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
http.listen(port, function() {
    console.log('Server started. Listening on port: ' + port)
})

let users = []
let messages = []

fs.readFile('creds.json', 'utf-8', function(err, data) {
    if (err) throw err
    creds = JSON.parse(data)
    client = redis.createClient('redis://' + creds.user + ':' + creds.password + '@' + creds.host + ':' + creds.port)

    client.once('ready', function() {
        console.log('redis ready')
        client.get('users', function(err, reply) {
            console.log('getting users from redis...')
            if (reply) {
                console.log('got reply from users redis')
                users = JSON.parse(reply)
            }
        })
    })

    client.get('messages', function(err, reply) {
        console.log('getting messages from redis...')
        if (reply) {
            console.log('got reply from messages redis')
            messages = JSON.parse(reply)
        }
    })
})

app.get('/', function (req, res) {
    console.log('/')
    res.sendFile('views/index.html', {
        root: __dirname
    })
    console.log('views/index.html')
})

app.post('/join', function(req, res) {
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

app.post('/leave', function(req, res) {
    console.log('** leave **')
    const username = req.body.username
    users.splice(users.indexOf(username), 1)
    client.set('users', JSON.stringify(users))
    res.send({
        'status': 'OK'
    })
})

app.post('/send_message', function(req, res) {
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

app.get('/get_messages', function(req, res) {
    console.log('** get_messages **')
    res.send(messages)
})

app.get('/get_users', function(req, res) {
    console.log('** get_users **')
    res.send(users)
})

io.on('connection', function(socket) {
    console.log('** connection **')
    socket.on('message', function(data) {
        console.log('** message **')
        io.emit('send', data)
    })

    socket.on('update_users_count', function(data) {
        console.log('** update_users_count **')
        io.emit('count_users', data)
    })
})
