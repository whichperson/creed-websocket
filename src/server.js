const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const employeeJSON = require('./assets/employees.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: 'http://localhost:8080'
});

// Connected Employees
let employeeIds = {};

const addEmployeeId = (socket) => {
   if (socket == null || socket.id == null) {
      return false;
   }

   const employeeData = employeeJSON.employees;
   const employeeIndex = Math.floor(Math.random() * employeeData.length);
   const { name, surname }  = employeeData[employeeIndex];

   if (name == null || surname == null) {
      return false;
   }

   const employeeId = `${socket.id}-${name}-${surname}`;
   socket.employeeId = employeeId;
   employeeIds[employeeId] = employeeId;

   return true;
}

io.on('connection', (socket) => {
   let addedEmployee = false;
   if (addEmployeeId(socket)) {
      addedEmployee = true;

      socket.broadcast.emit('employee joined', {
         employeeId: socket.employeeId
      });
   }

   socket.on('disconnect', () => {
      if (addedEmployee) {
         delete employeeIds[socket.employeeId];

         socket.broadcast.emit('employee quit', {
            employeeId: socket.employeeId
         });
      }
   });
});

httpServer.listen(3000);