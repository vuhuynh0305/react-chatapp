const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", (socket) => {
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser(socket.id, name, room);
        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `Welcome ${user.name} to room ${user.room}` });
        io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the room` });
        socket.join(user.room);

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
        callback();
    })

    socket.on('userIsTyping', () => {
        const user = getUser(socket.id);
        if (user) {
            console.log(user, 'user');
            io.to(user.room).emit('sendTyping', { name: user.name })
        }
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` })
        }
    })
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));