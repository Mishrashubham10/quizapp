import { useNavigate } from 'react-router-dom';
import { useCreateRoomMutation } from '@/features/rooms/roomsApi';
import { Button } from '@/components/ui/button';

export default function CreateRoomPage() {
  const navigate = useNavigate();

  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const handleCreateRoom = async () => {
    try {
      console.log('Creating room...');
      const room = await createRoom().unwrap();
      console.log('Room created:', room);

      navigate(`/lobby/${room.code}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Room</h1>

      <p className="text-muted-foreground">
        Start a new QuizBlitz session and invite your friends.
      </p>

      <Button onClick={handleCreateRoom} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Room'}
      </Button>
    </div>
  );
}