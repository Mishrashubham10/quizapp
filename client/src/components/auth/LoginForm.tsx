import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { useLoginMutation } from '@/features/auth/authApi';
import { socket } from '@/socket/socket';

export default function LoginForm() {
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();

      // Connect socket after authentication
      socket.connect();

      navigate('/dashboard');
    } catch (error) {
      console.error(error);

      setError('root', {
        message: 'Invalid email or password',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Sign In</FieldLegend>

          <FieldDescription>Continue your QuizBlitz journey.</FieldDescription>

          <FieldGroup>
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
              />

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* Server Error */}
        {errors.root && (
          <p className="text-sm text-destructive">{errors.root.message}</p>
        )}

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}