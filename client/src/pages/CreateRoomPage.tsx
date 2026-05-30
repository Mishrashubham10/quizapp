import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import { socket } from '../socket/socket';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const handleCreateRoom = () => {
    if (!name.trim()) {
      return;
    }

    const roomId = generateRoomId();

    socket.emit('create_room', {
      roomId,
      name,
    });

    navigate('/lobby');
  };

  return (
    <PageWrapper>
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6">Create Room</h1>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none"
        />

        <button
          onClick={handleCreateRoom}
          className="w-full mt-6 py-4 rounded-xl bg-cyan-500 text-black font-semibold"
        >
          Create Room
        </button>
      </div>
    </PageWrapper>
  );
}