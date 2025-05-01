import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const CreateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: 'Invalid email address' }
    ),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),

  uniqueId: z.string().min(1, 'Unique ID is required'),

  startDate: z.string().optional(),
  endDate: z.string().optional(),

  membershipId: z.string().uuid('Invalid membership ID'),
  staffId: z.string().uuid('Invalid staff ID'),
});

export type CreateMemberBody = z.infer<typeof CreateMemberSchema>;

export const UpdateMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .optional()
    .refine(
      (val) => val === undefined || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      { message: 'Invalid email address' }
    ),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  uniqueId: z.string().min(1, 'Unique ID is required'),
});

export type UpdateMemberBody = z.infer<typeof UpdateMemberSchema>;
