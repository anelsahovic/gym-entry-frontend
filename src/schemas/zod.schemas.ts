import { z } from 'zod';

export const LoginSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(20, "Username can't be longer than 20 characters"),
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

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(20, "Username can't be longer than 20 characters"),
  email: z.string().email(),
  password: z.string().max(50, 'Password cant be longer than 50 characters.'),
  role: z.enum(['STAFF', 'ADMIN']),
});

export type CreateUserBody = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(20, "Username can't be longer than 20 characters"),
  email: z.string().email(),
  role: z.enum(['STAFF', 'ADMIN']),
});

export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;

export const UpdateUserPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters'),
});

export type UpdateUserPasswordBody = z.infer<typeof UpdateUserPasswordSchema>;

export const ResetUserPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters'),
});

export type ResetUserPasswordBody = z.infer<typeof ResetUserPasswordSchema>;

export const ChangeUserPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cant be longer than 50 characters'),
});

export type ChangeUserPasswordBody = z.infer<typeof ChangeUserPasswordSchema>;

export const CreateMembershipSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationDays: z.number().min(1, 'Duration of the membership is required'),
  price: z.number(),
});

export type CreateMembershipBody = z.infer<typeof CreateMembershipSchema>;

export const UpdateMembershipSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationDays: z.number().min(1, 'Duration of the membership is required'),
  price: z.number(),
});

export type UpdateMembershipBody = z.infer<typeof UpdateMembershipSchema>;

export const FindMemberSchema = z.object({
  uniqueId: z.string().min(1, 'Unique ID is required'),
});

export type FindMemberBody = z.infer<typeof FindMemberSchema>;

export const ExtendMembershipSchema = z.object({
  // memberId: z.string().min(1, 'Member ID is required'),
  membershipId: z.string().min(1, 'Membership is required'),
});

export type ExtendMembershipBody = z.infer<typeof ExtendMembershipSchema>;
