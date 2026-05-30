import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="text-center">
        <div className="text-6xl mb-6">⚡</div>

        <h1 className="text-5xl font-bold mb-4">QuizBlitz</h1>

        <p className="text-gray-400 mb-10">
          Real-time multiplayer quiz battles
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/create-room')}
            className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition font-semibold text-black"
          >
            Host A Quiz
          </button>

          <button
            onClick={() => navigate('/join-room')}
            className="w-full py-4 rounded-xl border border-cyan-500 hover:bg-cyan-500/10 transition"
          >
            Join A Room
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}