const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const {
    Server
} = require('socket.io')

const io = new Server(server, {
    cors: {
        origin: ["http://stageofvisualization.local"],
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
        console.log('update-chat-noi-bo');
        io.emit('update-chat-noi-bo', data)
    })

})

server.listen(3001, () => {
    console.log('listening on port 3000')
})
