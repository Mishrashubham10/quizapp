import { generateRoomCode } from '../../shared/utils/generate-room-code';

import {
  DEFAULT_MAX_PLAYERS,
  MAX_ROOM_NAME_LENGTH,
  MIN_ROOM_NAME_LENGTH,
} from './room.constants';

import { RoomRepository } from './room.repository';

import {
  CreateRoomInput,
  JoinRoomInput,
  LeaveRoomInput,
  RoomState,
} from './rooms.types';

export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  // ================= CREATE ROOM =================

  async createRoom(
    input: CreateRoomInput,
    socketId: string,
  ): Promise<RoomState> {
    const name = input.name.trim();

    if (!name) {
      throw new Error('Room name is required');
    }

    if (name.length < MIN_ROOM_NAME_LENGTH) {
      throw new Error(
        `Room name must be at least ${MIN_ROOM_NAME_LENGTH} characters`,
      );
    }

    if (name.length > MAX_ROOM_NAME_LENGTH) {
      throw new Error(
        `Room name cannot exceed ${MAX_ROOM_NAME_LENGTH} characters`,
      );
    }

    const maxPlayers = input.maxPlayers ?? DEFAULT_MAX_PLAYERS;

    if (maxPlayers < 2) {
      throw new Error('Room must allow at least 2 players');
    }

    let code = generateRoomCode();

    let existingRoom = await this.roomRepository.findByCode(code);

    while (existingRoom) {
      code = generateRoomCode();

      existingRoom = await this.roomRepository.findByCode(code);
    }

    const room = await this.roomRepository.createWithHost(
      {
        code,
        name,
        maxPlayers,
        isPrivate: input.isPrivate ?? false,
        status: 'WAITING',

        host: {
          connect: {
            id: input.hostId,
          },
        },
      },
      input.hostId,
      socketId,
    );

    return this.getRoom(room.code);
  }

  // ================= GET ROOM =================

  async getRoom(code: string): Promise<RoomState> {
    const room = await this.roomRepository.findByCodeWithMembers(code);

    if (!room) {
      throw new Error('Room not found');
    }

    return {
      id: room.id,
      code: room.code,
      name: room.name,
      hostId: room.hostId,
      status: room.status,
      maxPlayers: room.maxPlayers,
      isPrivate: room.isPrivate,

      members: room.members.map((member) => ({
        id: member.id,
        userId: member.user.id,
        username: member.user.username,
        displayName: member.user.displayName,
        avatarUrl: member.user.avatarUrl,
        socketId: member.socketId,
        joinedAt: member.joinedAt,
      })),
    };
  }

  // ================= JOIN ROOM =================

  async joinRoom(input: JoinRoomInput, socketId: string): Promise<RoomState> {
    throw new Error('joinRoom not implemented yet');
  }

  // ================= LEAVE ROOM =================

  async leaveRoom(input: LeaveRoomInput): Promise<RoomState> {
    throw new Error('leaveRoom not implemented yet');
  }
}