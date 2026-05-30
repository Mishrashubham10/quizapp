import { useNavigate } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import { useResultStore } from '../store/resultStore';

export default function ResultsPage() {
  const navigate = useNavigate();

  const leaderboard = useResultStore((state) => state.leaderboard);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score);

  const winner = sortedLeaderboard[0];

  return (
    <PageWrapper>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>

          <p className="text-gray-400 uppercase tracking-widest text-sm">
            Winner
          </p>

          <h1 className="text-4xl font-bold text-cyan-400 mt-2">
            {winner?.name ?? 'No Winner'}
          </h1>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>

          <div className="space-y-3">
            {sortedLeaderboard.map((player, index) => {
              const medal =
                index === 0
                  ? '🥇'
                  : index === 1
                    ? '🥈'
                    : index === 2
                      ? '🥉'
                      : `#${index + 1}`;

              return (
                <div
                  key={player.socketId}
                  className={`flex items-center justify-between rounded-2xl px-4 py-4 border ${
                    index === 0
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-white/10 bg-black/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medal}</span>

                    <span className="font-medium">{player.name}</span>
                  </div>

                  <span className="font-bold text-cyan-400">
                    {player.score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full mt-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
        >
          Play Again
        </button>
      </div>
    </PageWrapper>
  );
}