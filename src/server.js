const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(server, {
   cors: ['https://creedthots.netlify.app/'],
   transports: ['websocket', 'polling']
});

// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const employeeJSON = require('./assets/employees.json');


// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//
// });

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

server.listen(process.env.PORT || 3000);