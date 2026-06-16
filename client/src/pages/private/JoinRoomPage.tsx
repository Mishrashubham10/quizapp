import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import { socket } from '../../socket/socket';

export default function JoinRoomPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (!name.trim() || !roomId.trim()) {
      return;
    }

    socket.emit('join_room', {
      roomId: roomId.toUpperCase(),
      name,
    });

    navigate('/lobby');
  };

  return (
    <PageWrapper>
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6">Join Room</h1>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none"
          />

          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room Code"
            className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none"
          />
        </div>

        <button
          onClick={handleJoinRoom}
          className="w-full mt-6 py-4 rounded-xl bg-cyan-500 text-black font-semibold"
        >
          Join Room
        </button>
      </div>
    </PageWrapper>
  );
}