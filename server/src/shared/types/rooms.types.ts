export interface User {
  socketId: string;
  name: string;
}

export interface Room {
  id: string;
  hostId: string;
  users: User[];
}

export interface RoomResponse {
  id: string;
  code: string;
  name: string;
  hostId: string;

  status: 'WAITING' | 'STARTED' | 'FINISHED';
}