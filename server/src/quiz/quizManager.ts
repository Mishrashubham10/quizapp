import { User } from '../types/rooms.types';
import { QuizState } from '../types/quiz.types';
import { questions } from './questions';

const quizStates = new Map<string, QuizState>();

export const startQuiz = (roomId: string, users: User[]) => {
  quizStates.set(roomId, {
    currentQuestionIndex: 0,

    scores: users.map((user) => ({
      socketId: user.socketId,
      name: user.name,
      score: 0,
    })),

    answeredPlayers: new Set(),
  });
};

export const getQuizState = (roomId: string) => {
  return quizStates.get(roomId);
};

export const nextQuestion = (roomId: string) => {
  const state = quizStates.get(roomId);

  if (!state) {
    return null;
  }

  state.currentQuestionIndex++;

  state.answeredPlayers.clear();

  return state;
};

export const submitAnswer = (
  roomId: string,
  socketId: string,
  answer: string,
) => {
  const state = quizStates.get(roomId);

  if (!state) {
    return;
  }

  const question = questions[state.currentQuestionIndex];

  if (!question) {
    return;
  }

  const player = state.scores.find((score) => score.socketId === socketId);

  if (!player) {
    return;
  }

  // Prevent duplicate answers
  if (state.answeredPlayers.has(socketId)) {
    return;
  }

  if (answer === question.answer) {
    player.score += 1;
  }

  state.answeredPlayers.add(socketId);
};

export const clearQuizState = (roomId: string) => {
  quizStates.delete(roomId);
};