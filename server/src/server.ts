import { socket } from './../../client/src/socket/socket';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { registerSocketHandlers } from './socket/socketHandler';

// ROUTES
import authRoutes from './auth/auth.routes';
import { authenticateSocket } from './socket/socketAuth';

const app = express();

const PORT = process.env.PORT || 5500;

// =========== MIDDLEWARES ============
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

// =========== CREATING SOCKET SERVER ===========
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// ========= AUTH ROUTE =========
app.use('/api/v1/auth', authRoutes);

// SOCKET MIDDLEWARE
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`${socket.data.user.username} connected (${socket.id})`);

  registerSocketHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log(`${socket.data.user.username} disconnected`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});