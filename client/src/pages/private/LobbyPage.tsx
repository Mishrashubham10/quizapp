import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { socket } from '@/socket/socket';

import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';

import { useGetRoomQuery } from '@/features/rooms/roomsApi';
import { useMeQuery } from '@/features/auth/authApi';

export default function LobbyPage() {
  const navigate = useNavigate();

  const { code } = useParams();

  const { data: currentUser } = useMeQuery();

  const {
    data: room,
    isLoading,
    isError,
  } = useGetRoomQuery(code!, {
    skip: !code,
  });

  useEffect(() => {
    const handleCountdown = () => {
      navigate('/countdown');
    };

    socket.on('quiz_countdown', handleCountdown);

    return () => {
      socket.off('quiz_countdown', handleCountdown);
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20">
          <h2 className="text-2xl font-semibold">Loading room...</h2>
        </div>
      </PageWrapper>
    );
  }

  if (isError || !room) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20">
          <h2 className="text-2xl font-semibold">Room not found</h2>
        </div>
      </PageWrapper>
    );
  }

  const isHost = currentUser?.id === room.hostId;

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartQuiz = () => {
    socket.emit('start_quiz', {
      roomId: room.id,
    });
  };

  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Room Code
            </p>

            <h1 className="mt-3 text-6xl font-bold tracking-tight">
              {room.code}
            </h1>

            <p className="mt-3 text-muted-foreground">
              Share this code with your friends to join the room.
            </p>

            <Button variant="outline" className="mt-6" onClick={copyRoomCode}>
              Copy Code
            </Button>
          </div>

          {/* Host Card */}
          <div className="mt-10 rounded-2xl border bg-muted/30 p-5">
            <p className="text-sm text-muted-foreground">Host</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl">👑</span>

              <span className="font-semibold">{room.host.username}</span>
            </div>
          </div>

          {/* Players */}
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Players</h2>

              <span className="text-sm text-muted-foreground">
                {room.members.length} Player
                {room.members.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {room.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-4"
                >
                  <span className="font-medium">{member.user.username}</span>

                  {member.user.id === room.hostId && (
                    <span className="rounded-full border px-3 py-1 text-xs font-medium">
                      Host
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10">
            {isHost ? (
              <Button size="lg" className="w-full" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            ) : (
              <div className="rounded-xl border bg-muted/20 p-4 text-center text-muted-foreground">
                Waiting for the host to start the quiz...
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}