export interface User {
  socketId: string;
  name: string;
}

export interface Room {
  id: string;
  hostId: string;
  users: User[];
}