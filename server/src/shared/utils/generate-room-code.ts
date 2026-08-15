import { ROOM_CODE_LENGTH } from '../../modules/rooms/room.constants';

const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(length = 6): string {
  let code = '';

  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    const index = Math.floor(Math.random() * CHARACTERS.length);
    code += CHARACTERS[index];
  }

  return code;
}