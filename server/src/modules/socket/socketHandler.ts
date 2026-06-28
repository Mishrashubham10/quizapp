import { Server } from 'socket.io';

import { registerRoomSocket } from '../rooms/room.socket';
import { registerQuizSocket } from '../quiz/quiz.socket';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`Client Connected: ${socket.id}`);

    registerRoomSocket(io, socket);
    registerQuizSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`🔴 Client Disconnected: ${socket.id}`);
    });
  });
};