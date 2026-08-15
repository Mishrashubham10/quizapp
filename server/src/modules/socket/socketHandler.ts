import { Server, Socket } from 'socket.io';
import { registerRoomSocket } from '../rooms/room.socket';

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  registerRoomSocket(io, socket);
  // registerQuizSocket(io, socket);
};
