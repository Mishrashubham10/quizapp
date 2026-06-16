import { Link } from 'react-router-dom';

import LoginForm from '@/components/auth/LoginForm';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Welcome Back</CardTitle>

          <CardDescription>
            Sign in to continue your QuizBlitz journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}