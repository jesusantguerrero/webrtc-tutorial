const fs = require('fs');
const path = require('path');
const os = request('os');
const express = require('express');
const app = express();
const socketIO = require('socket.io');

app.use( express.static(path.resolve(__dirname, 'work')))

app.get('/:page', (req, res) => {
  const page = req.params.page || 'index';
  res.sendFile(path.resolve(__dirname, 'work', `${page}.html`))
})

app.use( express.static(path.resolve(__dirname)))

app.get('/codelab-examples/:step/:page', (req, res) => {
  const { step, page } = req.params;
  res.sendFile(path.resolve(__dirname, 'codelab-examples', step, `${page ? page : 'index'}.html`));
});

const server = app.listen(5000, () => {
  console.log('running on port 5000');
})

const io = socketIO.listen(server);

io.sockets.on('connection', (client) => {

  client.on('message', (message) => {
    console.log(`client said:${message}`);
    client.emit('message', message);
  })

  client.on('create or join', (room) => {
    console.log(`creating or join room: ${room}`);
    const clientsCount = io.sockets.sockets.length;
    
    if (clientsCount <= 2) {
      console.log(`${room} has ${clientsCount} client(s)`)
      client.join(room)
      if (clientsCount == 1) {
        client.emit('created', room, client.id)
      } else {
        console.log(` client id ${client.id} has joined ${room}`)
        client.emit('joined', room, client.id)
        io.send.in(room).emit('ready')
      }
    } else {
      client.emit('full', room);
    }
  })

  client.on('ipAddr', () => {
    const iFaces = os.networkInterfaces();
    for (let dev in iFaces) {
      iFaces[dev].forEach((details) => {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          client.emit('ipAddr', details.address)
        }
      })
    }
  })
})
