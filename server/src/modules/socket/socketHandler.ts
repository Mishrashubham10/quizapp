import { Server } from 'socket.io';

import { registerRoomSocket } from '../rooms/room.socket';
import { registerQuizSocket } from '../quiz/quiz.socket';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    registerRoomSocket(io, socket);
    registerQuizSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};