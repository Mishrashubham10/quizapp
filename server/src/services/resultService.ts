import { prisma } from '../lib/prisma';

interface LeaderboardPlayer {
  socketId: string;
  name: string;
  score: number;
}

export const saveQuizResult = async (
  roomId: string,
  leaderboard: LeaderboardPlayer[],
) => {
  return prisma.quizResult.create({
    data: {
      roomId,

      players: {
        create: leaderboard.map((player) => ({
          playerName: player.name,
          score: player.score,
        })),
      },
    },

    include: {
      players: true,
    },
  });
};