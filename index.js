const { SERVER_CONFIG, ENV } = require('./glb/cfglb')
const express = require('express')
const { Server } = require('socket.io')
const app = express()
const fs = require("fs");
const http = require(ENV === 'localhost' ? 'http' : 'https')

// cấu hình httpServer
var httpServer = null;
if (ENV === 'localhost') {
    httpServer = http.createServer(app)
} else {
    const options = {
        key: fs.readFileSync("/etc/letsencrypt/live/quancoder.online/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/quancoder.online/fullchain.pem")
    };
    httpServer = http.createServer(options, app)
}



// cấu hình Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ["https://stageofvisualization.com", "http://stageofvisualization.local"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// socket ON
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

httpServer.listen(SERVER_CONFIG.PORT, () => {
    console.log(`listening on port ${SERVER_CONFIG.PORT}`)
})
