const { SERVER_CONFIG } = require('./glb/cfglb')
const express = require('express')
const app = express()
const https = require('https')
// const cors = require('cors')F
const httpServer = https.createServer(app)
const {Server} = require('socket.io')

// 
const corsOptions = {
    origin: ["https://stageofvisualization.com", "http://stageofvisualization.local"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
};


// for Socket.IO
const io = new Server(httpServer, {
    cors: corsOptions
});


// for Express
// app.use(cors(corsOptions));

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
