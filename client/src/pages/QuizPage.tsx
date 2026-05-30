import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '../socket/socket';

import { useQuizStore } from '../store/quizStore';
import { useRoomStore } from '../store/roomStore';
import { useResultStore } from '../store/resultStore';

import PageWrapper from '../components/PageWrapper';

export default function QuizPage() {
  const navigate = useNavigate();

  const room = useRoomStore((state) => state.room);

  const currentQuestion = useQuizStore((state) => state.currentQuestion);

  const startTime = useQuizStore((state) => state.startTime);

  const duration = useQuizStore((state) => state.duration);

  const leaderboard = useResultStore((state) => state.leaderboard);

  const [timeLeft, setTimeLeft] = useState(duration);

  const [answeredQuestionId, setAnsweredQuestionId] = useState<number | null>(
    null,
  );

  const answered = answeredQuestionId === currentQuestion?.id;
  console.log('Leaderboard:', leaderboard);

  useEffect(() => {
    if (leaderboard.length > 0) {
      navigate('/results');
    }
  }, [leaderboard, navigate]);

  useEffect(() => {
    if (!startTime) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);

      const remaining = Math.max(duration - elapsed, 0);

      setTimeLeft(remaining);
    }, 250);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  if (!currentQuestion) {
    return (
      <PageWrapper>
        <div className="text-center">
          <h2 className="text-2xl">Waiting for question...</h2>
        </div>
      </PageWrapper>
    );
  }

  const progress = (timeLeft / duration) * 100;

  return (
    <PageWrapper>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400">Time Left</span>

            <span className="text-2xl font-bold text-cyan-400">
              {timeLeft}s
            </span>
          </div>

          <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              disabled={answered}
              onClick={() => {
                if (!room || answered) {
                  return;
                }

                socket.emit('submit_answer', {
                  roomId: room.id,

                  answer: option,
                });

                setAnsweredQuestionId(currentQuestion.id);
              }}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                answered
                  ? 'bg-cyan-500/20 border-cyan-500'
                  : 'bg-black/20 border-white/10 hover:border-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              <span className="font-semibold mr-3 text-cyan-400">
                {['A', 'B', 'C', 'D'][index]}
              </span>

              {option}
            </button>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}