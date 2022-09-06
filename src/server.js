const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

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