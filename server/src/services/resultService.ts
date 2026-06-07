interface LeaderboardPlayer {
  socketId: string;
  name: string;
  score: number;
}

// The previous QuizResult/PlayerScore tables were removed from the Prisma
// schema. Keep this helper available for callers while results storage is
// redesigned around QuizSession/QuizParticipant.
export const saveQuizResult = async (
  roomId: string,
  leaderboard: LeaderboardPlayer[],
) => {
  return {
    roomId,
    leaderboard,
  };
};
