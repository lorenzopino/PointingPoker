const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Track connected clients
let clients = [];

// Socket.io connection handler
io.on('connection', (socket) => {
  // Add new client to the list
  clients.push(socket);

  // Handle client disconnection
  socket.on('disconnect', () => {
    // Remove disconnected client from the list
    clients = clients.filter((client) => client.id !== socket.id);
  });

  // Handle vote submission
  socket.on('vote', (vote) => {
    // Broadcast the vote to all connected clients
    io.emit('newVote', { id: socket.id, vote });
  });
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
