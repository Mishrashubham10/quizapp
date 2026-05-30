import { create } from 'zustand';

export interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuizStore {
  currentQuestion: Question | null;
  startTime: number | null;
  duration: number;

  setCurrentQuestion: (question: Question) => void;

  setTimerData: (startTime: number, duration: number) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuestion: null,
  startTime: null,
  duration: 10,

  setCurrentQuestion: (question) =>
    set({
      currentQuestion: question,
    }),

  setTimerData: (startTime, duration) =>
    set({
      startTime,
      duration,
    }),
}));