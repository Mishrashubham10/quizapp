import { create } from 'zustand';
import type { PlayerScore } from '../types/result';

interface ResultStore {
  leaderboard: PlayerScore[];

  setLeaderboard: (leaderboard: PlayerScore[]) => void;
  clearLeaderboard: () => void;
}

export const useResultStore = create<ResultStore>((set) => ({
  leaderboard: [],

  setLeaderboard: (leaderboard) =>
    set({
      leaderboard,
    }),

    clearLeaderboard: () => set({ leaderboard: [] }),
}));