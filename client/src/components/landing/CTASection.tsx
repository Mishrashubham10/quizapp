import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary to-violet-600 px-8 py-16 text-center text-primary-foreground shadow-2xl md:px-16">
          {/* Decorative Glows */}
          <div className="absolute -left-20 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Ready to challenge your friends?
            </h2>

            <p className="mb-10 text-lg opacity-90 md:text-xl">
              Join QuizBlitz today and experience the excitement of real-time
              multiplayer quizzes.
            </p>

            <Button size="lg" variant="secondary" asChild className="group">
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}