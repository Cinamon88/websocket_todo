const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000)
});

const path = require('path');
const io = socket(server);

const tasks = [];


app.use(express.static(path.join(__dirname, '/client/client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/client/build/index.html'));
});

io.on("connection", (socket) => {
  console.log("Client connected with ID:", socket.id);
  socket.emit('updateData', tasks);
  socket.on("addTask", (task) => {
    console.log("Task added");
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });
  socket.on("removeTask", (task) => {
    tasks.splice(tasks.indexOf(task), 1);
    socket.broadcast.emit("removeTask", task);
  });
});