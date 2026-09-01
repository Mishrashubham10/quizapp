import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers and underscores',
      )
      .optional(),

    displayName: z
      .string()
      .trim()
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name cannot exceed 50 characters')
      .optional(),

    avatarUrl: z.string().url('Invalid avatar URL').nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field is required',
  });
