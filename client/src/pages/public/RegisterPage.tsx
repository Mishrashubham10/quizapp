import { Link } from 'react-router-dom';

import RegisterForm from '@/components/auth/RegisterForm';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Join QuizBlitz</CardTitle>

          <CardDescription>
            Create your account and start competing today.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}