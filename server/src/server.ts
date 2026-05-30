import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { registerSocketHandlers } from './socket/socketHandler';

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  registerSocketHandlers(io, socket);
});

httpServer.listen(5500, () => {
  console.log('Server running on port 5500');
});