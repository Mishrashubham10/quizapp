import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function QuickActions() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">Quick Actions</h2>

      <div className="flex flex-wrap gap-4">
        <Button asChild>
          <Link to="/create-room">Create Room</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link to="/join-room">Join Room</Link>
        </Button>
      </div>
    </section>
  );
}