import { Server, Socket } from 'socket.io';
import { roomService } from './room.module';

interface CreateRoomPayload {
  name: string;
  maxPlayers?: number;
  isPrivate?: boolean;
}

export const registerRoomSocket = (io: Server, socket: Socket) => {
  // ============== CREATE ROOM =============
  socket.on('room:create', async (payload: CreateRoomPayload) => {
    try {
      const user = socket.data.user;

      // payload validation
      if (!payload || typeof payload.name !== 'string') {
        throw new Error('Invalid room data');
      }

      const room = await roomService.createRoom(
        {
          name: payload.name,
          hostId: user.id,
          maxPlayers: payload.maxPlayers,
          isPrivate: payload.isPrivate,
        },
        socket.id,
      );

      // ADD HOST TO SOCKET.IO ROOM
      socket.join(room.code);

      // SEND ROOM STATE BACK TO CREATOR
      socket.emit('room:created', {
        room,
      });

      console.log(`Room ${room.code} created by ${user.username}`);
    } catch (err) {
      console.error('Room creation failed:', err);

      socket.emit('room:error', {
        message: err instanceof Error ? err.message : 'Failed to create room',
      });
    }
  });
};