import StatsCard from '@/components/dashboard/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';

import { useMeQuery } from '@/features/auth/authApi';

export default function DashboardPage() {
  const { data: user } = useMeQuery();

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back,{' '}
          <span className="quizblitz-text-gradient">{user?.username}</span> 👋
        </h1>

        <p className="mt-2 text-muted-foreground">
          Ready for another challenge? Create a room, join friends, and dominate
          the leaderboard.
        </p>
      </section>

      {/* Stats */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Overview</h2>

          <p className="text-muted-foreground">Track your QuizBlitz journey.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Games Played"
            value={0}
            description="Total quizzes completed"
          />

          <StatsCard
            title="Wins"
            value={0}
            description="First-place finishes"
          />

          <StatsCard
            title="Average Score"
            value={0}
            description="Points earned per game"
          />

          <StatsCard
            title="Best Streak"
            value={0}
            description="Consecutive correct answers"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <QuickActions />

      {/* Coming Soon */}
      <section>
        <div className="rounded-3xl border bg-card p-8">
          <h2 className="mb-4 text-2xl font-semibold">Coming Soon 🚀</h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-dashed p-6">
              <h3 className="font-medium">Match History</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Review previous quiz performances.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed p-6">
              <h3 className="font-medium">Real-Time Chat</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Communicate with players in your room.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed p-6">
              <h3 className="font-medium">Achievements</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Unlock badges and milestones.
              </p>
            </div>

            <div className="rounded-2xl border border-dashed p-6">
              <h3 className="font-medium">Global Rankings</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Compete against players worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}