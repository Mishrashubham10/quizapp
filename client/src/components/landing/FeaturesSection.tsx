import {
  Trophy,
  Users,
  Shield,
  History,
  MessageSquare,
  Crown,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    title: 'Real-Time Multiplayer',
    description:
      'Compete with friends instantly using live Socket.IO-powered gameplay.',

    icon: Users,
  },

  {
    title: 'Secure Authentication',
    description: 'Protected with JWT authentication and HTTP-only cookies.',

    icon: Shield,
  },

  {
    title: 'Live Leaderboards',
    description: 'Track rankings as players answer questions in real time.',

    icon: Trophy,
  },

  {
    title: 'Match History',
    description: 'Review past performances and improve your quiz skills.',

    icon: History,
  },

  {
    title: 'Instant Chat',
    description: 'Communicate with teammates and opponents seamlessly.',

    icon: MessageSquare,
  },

  {
    title: 'Host Controls',
    description:
      'Create rooms, manage players, and control the entire experience.',

    icon: Crown,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to host amazing quizzes
          </h2>

          <p className="text-lg text-muted-foreground">
            QuizBlitz combines real-time competition, seamless communication,
            and powerful host controls into one beautiful experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group border-border/50 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                <CardContent className="space-y-6 p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold">
                      {feature.title}
                    </h3>

                    <p className="leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}