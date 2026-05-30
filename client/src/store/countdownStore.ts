import { create } from 'zustand';

interface CountdownStore {
  active: boolean;

  setActive: (active: boolean) => void;
}

export const useCountdownStore = create<CountdownStore>((set) => ({
  active: false,

  setActive: (active) =>
    set({
      active,
    }),
}));