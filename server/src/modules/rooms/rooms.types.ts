import { RoomStatus } from '@prisma/client';

export interface CreateRoomInput {
  name: string;
  hostId: string;
  maxPlayers?: number;
  isPrivate?: boolean;
}

export interface JoinRoomInput {
  code: string;
}

export interface LeaveRoomInput {
  code: string;
}

export interface RoomState {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  maxPlayers: number;
  isPrivate: boolean;
  members: RoomMemberState[];
}

export interface RoomMemberState {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  socketId: string | null;
  joinedAt: Date;
}