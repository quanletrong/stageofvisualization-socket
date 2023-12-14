const {SERVER_CONFIG} = require('./glb/cfglb')
const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {
    Server
} = require('socket.io')

const io = new Server(server, {
    cors: {
        origin: ["https://stageofvisualization.com"],
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "http://stageofvisualization.local",
                "Access-Control-Allow-Methods": "GET,POST",
                "Access-Control-Allow-Headers": "my-custom-header",
                "Access-Control-Allow-Credentials": true
            });
            res.end();
        }
    }
})

io.on('connection', (socket) => {
    console.log('user connect');
    socket.on('on-chat', data => {
        io.emit('user-chat', data)
    })
    socket.on('update-chat-noi-bo', data => {
        io.emit('update-chat-noi-bo', data)
    })

    socket.on('update-chat-khach', data => {
        io.emit('update-chat-khach', data)
    })

})

server.listen(SERVER_CONFIG.PORT, () => {
    console.log(`listening on port ${SERVER_CONFIG.PORT}`)
})
