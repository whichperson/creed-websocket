const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const employeeJSON = require('./assets/employees.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
   cors: 'http://localhost:8080/'
});

// Connected Employees
let employees = [];

const addEmployee = (socket) => {
   if (socket == null || socket.id == null) {
      return false;
   }

   const employeeData = employeeJSON.employees;
   const employeeIndex = Math.floor(Math.random() * employeeData.length);
   const { name, surname }  = employeeData[employeeIndex];

   if (name == null || surname == null) {
      return false;
   }

   const employee = {
      id: socket.id,
      name: name,
      surname: surname
   };

   socket.employee = employee;
   employees.push(employee);

   return true;
}

io.on('connection', (socket) => {
   let addedEmployee = false;
   if (addEmployee(socket)) {
      addedEmployee = true;

      socket.broadcast.emit('employee joined', {
         employee: socket.employee
      });
   }

   socket.on('update content', (content) => {
      socket.broadcast.emit('content updated', content);
   });

   socket.on('disconnect', () => {
      if (addedEmployee) {
         employees = employees.filter(x => x.id === socket.employee.id);

         socket.broadcast.emit('employee quit', {
            employee: socket.employee
         });
      }
   });
});

httpServer.listen(3000);