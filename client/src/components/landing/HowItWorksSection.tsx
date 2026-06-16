import { UserPlus, Users, Trophy } from 'lucide-react';

const steps = [
  {
    number: '01',

    title: 'Create an Account',

    description:
      'Sign up in seconds and personalize your QuizBlitz experience.',

    icon: UserPlus,
  },

  {
    number: '02',

    title: 'Join or Create a Room',

    description:
      'Invite friends with room codes or jump into public competitions.',

    icon: Users,
  },

  {
    number: '03',

    title: 'Compete & Win',

    description:
      'Answer quickly, climb the leaderboard, and become the champion.',

    icon: Trophy,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            How QuizBlitz Works
          </h2>

          <p className="text-lg text-muted-foreground">
            Get started in minutes and experience the excitement of real-time
            quizzes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 lg:grid-cols-3">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-16 hidden h-px w-2/3 -translate-x-1/2 bg-border lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Circle */}
                <div className="relative z-10 mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                  <Icon className="h-10 w-10" />
                </div>

                {/* Number */}
                <span className="mb-3 text-sm font-semibold tracking-widest text-primary">
                  STEP {step.number}
                </span>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="max-w-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}