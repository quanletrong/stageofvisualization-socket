import { SERVER_CONFIG } from './glb/cfglb.js';
import express from 'express';
import { Server } from 'socket.io';
import fs from "fs";
const http = await import(SERVER_CONFIG.ENV === 'localhost' ? 'http' : 'https');
import { GLBVARS } from 'config-custom';
import { Authentication } from 'mdauthentication';

const app = express();
const Authen = new Authentication.default();

// cấu hình httpServer
var httpServer = null;
if (SERVER_CONFIG.ENV === 'localhost') {
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
console.log(GLBVARS.arrUserConnectId);
// socket ON
io
    .setMaxListeners(0)
    .use(Authen.handle_callback_middlewares)
    .on('connection', (socket) => {

        socket.on('disconnect', () => {
            if (GLBVARS.arrConnectIdByUser.hasOwnProperty(socket.id)) {
                let uconnectid = GLBVARS.arrConnectIdByUser[socket.id];
                let ugroupid = '';
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uconnectid)) {
                    ugroupid = GLBVARS.arrUserConnectId[uconnectid]['gid'];
                    let idxConnId = GLBVARS.arrUserConnectId[uconnectid]['cids'].findIndex(itm => itm == socket.id);
                    if (idxConnId != -1) {
                        GLBVARS.arrUserConnectId[uconnectid]['cids'].splice(idxConnId, 1);
                    }

                    // remove if empty
                    if (GLBVARS.arrUserConnectId[uconnectid]['cids'].length == 0) {
                        delete GLBVARS.arrUserConnectId[uconnectid];
                        // remove user from group
                        if (ugroupid != '') {
                            if (GLBVARS.arrGroupUserId.hasOwnProperty(ugroupid)) {
                                let idxUserId = GLBVARS.arrGroupUserId[ugroupid].findIndex(itm => itm == uconnectid);
                                if (idxUserId != -1) {
                                    GLBVARS.arrGroupUserId[ugroupid].splice(idxUserId, 1);
                                }
                            }
                        }
                    }
                }

                // delete connect id by user
                delete GLBVARS.arrConnectIdByUser[socket.id];
            }
        });

        socket.on('on-chat', data => {
            io.emit('user-chat', data)
        })
        socket.on('update-chat-noi-bo', data => {
            io.emit('update-chat-noi-bo', data)
        })

        socket.on('update-chat-khach', data => {
            io.emit('update-chat-khach', data)
        })

        socket.on('update-chat-tong', data => {
            io.emit('update-chat-tong', data)
        })

        // EVENT GCHAT
        socket.on('add-gchat', data => {
            // all member => add-msg-to-group
            data.member_ids.forEach(uid => {
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uid)) {
                    for (let id of GLBVARS.arrUserConnectId[uid]['cids']) {
                        io.to(id).emit('add-gchat', data);
                    }
                }
            })
        })

        socket.on('edit-gchat', data => {

            // all member => add-msg-to-group
            data.member_ids.forEach(uid => {
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uid)) {
                    for (let id of GLBVARS.arrUserConnectId[uid]['cids']) {
                        io.to(id).emit('add-msg-to-gchat', data);
                        io.to(id).emit('update-name-gchat', data);
                    }
                }
            })

            // member_new => add-gchat
            data.member_new.forEach(uid => {
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uid)) {
                    for (let id of GLBVARS.arrUserConnectId[uid]['cids']) {
                        io.to(id).emit('add-gchat', data);
                    }
                }
            })

            // member_del => delete-gchat
            data.member_del.forEach(uid => {
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uid)) {
                    for (let id of GLBVARS.arrUserConnectId[uid]['cids']) {
                        io.to(id).emit('delete-gchat', data);
                    }
                } else {

                }
            })
        })

        socket.on('delete-gchat', data => {
            io.emit('delete-gchat', data)
        })

        socket.on('add-msg-to-gchat', data => {
            //push msg to client by connection id
            data.member_group.push(data.action_by);
            data.member_group.forEach(uid => {
                if (GLBVARS.arrUserConnectId.hasOwnProperty(uid)) {
                    for (let id of GLBVARS.arrUserConnectId[uid]['cids']) {
                        io.to(id).emit('add-msg-to-gchat', data);
                    }
                }
            })
        })
        // EVENT GCHAT

        socket.on('refresh', data => {
            io.emit('refresh', data)
        })

    })

httpServer.listen(SERVER_CONFIG.PORT, () => {
    console.log(`listening on port ${SERVER_CONFIG.PORT}`)
})
