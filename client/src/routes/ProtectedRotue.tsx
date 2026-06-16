import { useMeQuery } from '@/features/auth/authApi';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRotue() {
  const { data: user, isLoading } = useMeQuery({});

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}