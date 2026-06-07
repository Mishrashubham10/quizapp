import { prisma } from '../lib/prisma';

// ========== CREATE SESSION ============
export const createQuizSession = async (roomId: string) => {
  return prisma.quizSession.create({
    data: {
      roomId,
    },
  });
};

// ========== GET ACTIVE SESSION ============
export const getActiveSession = async (roomId: string) => {
  return prisma.quizSession.findFirst({
    where: {
      roomId,
      status: {
        not: 'FINISHED',
      },
    },
  });
};

// ========== ADVANCE QUESTION ============
export const advanceQuestion = async (sessionId: string, nextIndex: number) => {
  return prisma.quizSession.update({
    where: {
      id: sessionId,
    },

    data: {
      currentQuestionIndex: nextIndex,
    },
  });
};

// ========== FINISH SESSION ============
export const finishSession = async (sessionId: string) => {
  return prisma.quizSession.update({
    where: {
      id: sessionId,
    },

    data: {
      status: 'FINISHED',
      finishedAt: new Date(),
    },
  });
};
