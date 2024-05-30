const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

//const io = require('socket.io')(server);
const { Server } = require("socket.io");
const io = new Server(server, {
    pingTimeout: 30000, // 30 seconds
  });

app.use(express.static(path.join(__dirname, '/public')));

io.on("connection", (socket) => {
    // console.log('a user connected');
    socket.on('error', function (err) {
        console.log(err);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on("sender-join", (data) => {
        socket.join(data.uid);
    });
    socket.on("receiver-join", (data) => {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });
    socket.on("file-meta", (data) => {
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });
    socket.on("fs-start", (data) => {
        socket.in(data.uid).emit("fs-share", {});
    });
    socket.on("fs-raw", (data) => {
        socket.in(data.uid).emit("fs-share", data.buffer);
    });
});

server.listen(8000);