import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLogoutMutation, useMeQuery } from '@/features/auth/authApi';
import { socket } from '@/socket/socket';

export default function Topbar() {
  const navigate = useNavigate();

  const { data: user } = useMeQuery();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      socket.disconnect();

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.username} 👋
          </h1>

          <p className="text-muted-foreground">Ready for another challenge?</p>
        </div>

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}