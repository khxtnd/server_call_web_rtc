const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Types = require('./types');

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const clients = {};
wss.on('connection', function connection(ws, req) {

  const clientId = req.url.split('?')[1].split('=')[1];
  clients[clientId] = ws;
  console.log(clientId + ' connected');
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message)
    console.log(data.type)
    Object.keys(clients).forEach(function (clientId) {
      if (clientId === data.toId) {
        clients[clientId].send(JSON.stringify(data));
      }
    })

  });

  ws.on('close', function close() {
    console.log('client connection closed.');
    Object.keys(clients).forEach(function (clientId) {
      if (clients[clientId] === ws) {
        delete clients[clientId];
      }
    });
  });
});


server.listen(3000, function listening() {
  console.log('Server started and listening on port 3000');
});
