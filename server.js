const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const path = require('path');
const io = socket(server);

app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
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