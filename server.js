const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

//const io = require('socket.io')(server);
const { Server } = require("socket.io");
const io = new Server(server, {
    pingTimeout: 30000, // 30 seconds
});

// setup mongo
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority&appName=AtlasCluster`;
let db;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const { generateID } = require('./public/assets/js/utils.js');
let sockets = {}; // Store socket IDs => socket objects

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        db = await client.db(process.env.MONGO_DB_NAME);
        await db.command({ ping: 1 });
        await db.collection("ids").createIndex({ "uid": 1 }, { unique: true });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        return db;
    }
}
db = run().catch(console.dir);


app.use(express.static(path.join(__dirname, '/public')));

io.on("connection", (socket) => {
    socket.on('error', function (err) {
        console.log(err);
    });

    socket.on('disconnect', async () => {
        try {
            let uid = socket.customId;
            await db.collection('ids').deleteOne({ uid: uid });
            delete sockets[socket.customId];
        } catch (error) {
            console.error('Error freeing ID:', error);
        }
    });

    socket.on("generate-id", async () => {
        try {
            let uid = await generateID(db);
            io.to(socket.id).emit("id-generated", { id: uid });
            socket.customId = uid;
            sockets[uid] = socket;
        } catch (error) {
            console.error('Error generating ID:', error);
        }
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