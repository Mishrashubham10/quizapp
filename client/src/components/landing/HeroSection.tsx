import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Trophy, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Side */}
          <div className="space-y-8">
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-1 text-sm"
            >
              🚀 Real-Time Multiplayer Quiz Platform
            </Badge>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
                Create.
                <br />
                <span className="quizblitz-text-gradient">Compete.</span>
                <br />
                Dominate.
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Challenge friends, classmates, and communities in exciting
                real-time quizzes with live leaderboards and instant results.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="group">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid max-w-lg grid-cols-3 gap-6 pt-6">
              <div>
                <div className="text-3xl font-bold">10K+</div>

                <div className="text-sm text-muted-foreground">Players</div>
              </div>

              <div>
                <div className="text-3xl font-bold">500+</div>

                <div className="text-sm text-muted-foreground">
                  Rooms Created
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold">99.9%</div>

                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative">
            <Card className="overflow-hidden border-border/50 bg-card/80 shadow-2xl backdrop-blur">
              <CardContent className="space-y-6 p-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Live Quiz</p>

                    <h3 className="text-xl font-semibold">General Knowledge</h3>
                  </div>

                  <Badge>Question 3/10</Badge>
                </div>

                {/* Question */}
                <div className="space-y-4">
                  <p className="text-lg font-medium">
                    Which planet is known as the Red Planet?
                  </p>

                  <div className="grid gap-3">
                    {['Earth', 'Mars', 'Venus', 'Jupiter'].map(
                      (option, index) => (
                        <button
                          key={option}
                          className={`rounded-xl border p-4 text-left transition-all hover:border-primary hover:bg-primary/10 ${
                            index === 1 ? 'border-primary bg-primary/10' : ''
                          }`}
                        >
                          {option}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between rounded-xl bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />

                    <span className="font-medium">Time Remaining</span>
                  </div>

                  <span className="text-xl font-bold">08s</span>
                </div>

                {/* Leaderboard */}
                <div className="rounded-xl bg-muted p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />

                    <span className="font-semibold">Live Leaderboard</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: 'Shubham',
                        score: 250,
                      },
                      {
                        name: 'Alex',
                        score: 200,
                      },
                      {
                        name: 'Emma',
                        score: 180,
                      },
                    ].map((player, index) => (
                      <div
                        key={player.name}
                        className="flex items-center justify-between rounded-lg bg-background p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </div>

                          <span className="font-medium">{player.name}</span>
                        </div>

                        <span className="font-bold">{player.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Players Online */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />

                  <span>24 players competing right now</span>
                </div>
              </CardContent>
            </Card>

            {/* Floating Decoration */}
            <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-primary/20 blur-3xl md:block" />

            <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-full bg-accent/20 blur-3xl md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}