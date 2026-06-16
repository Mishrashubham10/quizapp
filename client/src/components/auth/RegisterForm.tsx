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
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas';
import { useRegisterMutation } from '@/features/auth/authApi';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      }).unwrap();

      navigate('/login');
    } catch (error: unknown) {
        const err = error as { data?: { message?: string } } | undefined;

        setError('root', {
          message: err?.data?.message ?? 'Registration failed',
        });
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup>
        {/* Account Information */}
        <FieldSet>
          <FieldLegend>Create Account</FieldLegend>

          <FieldDescription>
            Start your QuizBlitz journey today.
          </FieldDescription>

          <FieldGroup>
            {/* Username */}
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>

              <Input
                id="username"
                placeholder="shubham"
                autoComplete="username"
                {...register('username')}
              />

              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </Field>

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
          </FieldGroup>
        </FieldSet>

        {/* Security */}
        <FieldSet>
          <FieldLegend>Security</FieldLegend>

          <FieldDescription>
            Choose a strong password to protect your account.
          </FieldDescription>

          <FieldGroup>
            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password')}
              />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}