import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { useJoinRoomMutation } from '@/features/rooms/roomsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinRoomPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const [joinRoom, { isLoading }] = useJoinRoomMutation();

  const handleJoinRoom = async () => {
    try {
      setError('');

      if (!code.trim()) {
        setError('Please enter a room code');
        return;
      }

      const room = await joinRoom(code.trim().toUpperCase()).unwrap();

      navigate(`/lobby/${room.code}`);
    } catch (error: unknown) {
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof (error as { data: unknown }).data === 'object' &&
        error !== null &&
        'message' in (error as { data: { message: unknown } }).data &&
        typeof (error as { data: { message: unknown } }).data.message === 'string'
          ? (error as { data: { message: string } }).data.message
          : 'Failed to join room';

      setError(errorMessage);
    }
  };
  return (
    <PageWrapper>
      <div className="mx-auto max-w-lg">
        <div className="rounded-3xl border bg-card p-8 text-card-foreground shadow-sm">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">Join a Room</h1>

            <p className="mt-2 text-muted-foreground">
              Enter the room code shared by your friends.
            </p>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Room Code
              </label>

              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="h-12 text-center text-lg font-semibold tracking-[0.3em]"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleJoinRoom}
              disabled={isLoading}
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}