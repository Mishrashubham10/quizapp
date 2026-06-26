import { Room, User } from '../types/rooms.types';

const rooms = new Map<string, Room>();

export const createRoom = (roomId: string, host: User) => {
  const room: Room = {
    id: roomId,
    hostId: host.socketId,
    users: [host],
  };

  rooms.set(roomId, room);

  return room;
};

export const getRoom = (roomId: string) => {
  return rooms.get(roomId);
};

export const joinRoom = (roomId: string, user: User) => {
  const room = rooms.get(roomId);

  if (!room) {
    return null;
  }

  room.users.push(user);

  return room;
};

export const removeUser = (socketId: string): Room | null => {
  let updatedRoom: Room | null = null;

  rooms.forEach((room) => {
    const userExists = room.users.some((user) => user.socketId === socketId);

    if (!userExists) return;

    room.users = room.users.filter((user) => user.socketId !== socketId);

    if (room.users.length === 0) {
      rooms.delete(room.id);
      return;
    }

    // Transfer host if host leaves
    if (room.hostId === socketId) {
      room.hostId = room.users[0].socketId;
    }

    updatedRoom = room;
  });

  return updatedRoom;
};