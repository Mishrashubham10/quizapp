import { useRoomStore } from '../../store/roomStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket/socket';
import PageWrapper from '../../components/PageWrapper';

export default function LobbyPage() {
  const room = useRoomStore((state) => state.room);

  const socketId = useRoomStore((state) => state.socketId);

  const navigate = useNavigate();

  useEffect(() => {
    const handleCountdown = () => {
      navigate('/countdown');
    };

    socket.on('quiz_countdown', handleCountdown);

    return () => {
      socket.off('quiz_countdown', handleCountdown);
    };
  }, [navigate]);

  if (!room) {
    return (
      <PageWrapper>
        <div className="text-center">
          <h2 className="text-2xl">Waiting for room...</h2>
        </div>
      </PageWrapper>
    );
  }

  const isHost = room.hostId === socketId;

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(room.id);

      alert('Room ID copied!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageWrapper>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
        <div className="text-center">
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            Room Code
          </p>

          <h1 className="text-5xl font-bold mt-2 mb-4 text-cyan-400">
            {room.id}
          </h1>

          <button
            onClick={copyRoomId}
            className="px-5 py-2 rounded-xl border border-cyan-500 hover:bg-cyan-500/10 transition"
          >
            Copy Code
          </button>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Players</h2>

          <div className="space-y-3">
            {room.users.map((user) => (
              <div
                key={user.socketId}
                className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3"
              >
                <span>{user.name}</span>

                {user.socketId === room.hostId && <span>👑 Host</span>}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <button
            onClick={() =>
              socket.emit('start_quiz', {
                roomId: room.id,
              })
            }
            className="w-full mt-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition"
          >
            Start Quiz
          </button>
        )}

        {!isHost && (
          <div className="text-center mt-8 text-gray-400">
            Waiting for host to start the quiz...
          </div>
        )}
      </div>
    </PageWrapper>
  );
}