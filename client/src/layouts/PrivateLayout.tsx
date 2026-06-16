import { Outlet } from 'react-router-dom';

export default function PrivateLayout() {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}

      <main>
        <Outlet />
      </main>
    </div>
  );
}