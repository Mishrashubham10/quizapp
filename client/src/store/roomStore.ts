import { create } from 'zustand';
import type { Room } from '../types/room';

interface RoomStore {
  room: Room | null;
  playerName: string;
  socketId: string;

  setRoom: (room: Room) => void;
  setPlayerName: (name: string) => void;
  setSocketId: (id: string) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  playerName: '',
  socketId: '',

  setRoom: (room) => set({ room }),

  setPlayerName: (name) => set({ playerName: name }),

  setSocketId: (id) => set({ socketId: id }),
}));