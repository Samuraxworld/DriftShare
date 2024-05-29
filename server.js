const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
//const io = require('socket.io')(server);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '/public')));

io.on("connection", (socket) => {
    console.log('a user connected');
    socket.on('error', function (err) {
        console.log(err);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(8000);