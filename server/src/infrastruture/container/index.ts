// infrastructure/container/index.ts

import { RoomRepository } from '../../modules/rooms/room.repositories';
import { RoomService } from '../../modules/rooms/room.service';

const roomRepository = new RoomRepository();

const roomService = new RoomService(roomRepository);

export { roomRepository, roomService };
