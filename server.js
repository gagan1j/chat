const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./public/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

const botname = 'HELLO B+';

// Create an object to store connected users
const connectedUsers = {};

io.on('connection', socket => {
    console.log('new ws connection...');

    // Listen for the "join" event to associate a username with the socket ID
    socket.on('join', username => {
        connectedUsers[socket.id] = username;
    });

    socket.emit('message', formatMessage(botname, 'Welcome'));

    socket.on('disconnect', () => {
        // Remove the user from the list of connected users when they disconnect
        delete connectedUsers[socket.id];
        console.log("A user disconnected");
    });

    socket.on('chatMessage', msg => {
        const username = connectedUsers[socket.id];
        io.emit('message', formatMessage(username, msg));
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));