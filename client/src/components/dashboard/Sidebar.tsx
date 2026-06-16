import { Link, useLocation } from 'react-router-dom';

import { LayoutDashboard, Plus, Users, History } from 'lucide-react';

const links = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },

  {
    label: 'Create Room',
    to: '/create-room',
    icon: Plus,
  },

  {
    label: 'Join Room',
    to: '/join-room',
    icon: Users,
  },

  {
    label: 'History',
    to: '/history',
    icon: History,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="border-b px-6 py-6">
        <Link
          to="/dashboard"
          className="text-2xl font-bold quizblitz-text-gradient"
        >
          QuizBlitz
        </Link>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />

              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}