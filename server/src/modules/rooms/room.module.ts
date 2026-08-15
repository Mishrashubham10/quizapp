import { RoomRepository } from './room.repository';
import { RoomService } from './rooms.service';

const roomRepository = new RoomRepository();

export const roomService = new RoomService(roomRepository);