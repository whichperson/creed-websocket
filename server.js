const ws = require('websocket');
const http = require('http');

const httpServer = http.createServer();
httpServer.listen(8080);

const wsServer = new ws.server({
    httpServer: httpServer
});

wsServer.on('request', (request) => {
    console.log(request);
});