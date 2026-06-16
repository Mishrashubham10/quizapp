import { Navigate, Outlet } from 'react-router-dom';

import { useMeQuery } from '@/features/auth/authApi';

export default function ProtectedRoute() {
  const { data: user, isLoading, isError } = useMeQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />

          <p className="text-muted-foreground">Loading QuizBlitz...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}