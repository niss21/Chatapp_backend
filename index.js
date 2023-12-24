require('dotenv').config()

const express = require('express');
const cors = require('cors')
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const PORT = process.env.PORT
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on ('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data)=> {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data)=> {
        socket.to(data.room).emit("receive_message",data);
    })

    socket.on("disconnect", ()=> {
        console.log("User Disconnected", socket.id);
    })

})

server.listen(PORT, ()=> {
    console.log(`Server running at PORT ${PORT}`);
})