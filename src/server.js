const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: 'http://localhost:8080'
});

io.on('connection', (socket) => {
   console.log(`${socket.id} employee has connected`);

   socket.on('disconnect', () => {
      console.log(`${socket.id} employee has disconnected`);
   })
});

httpServer.listen(3000);