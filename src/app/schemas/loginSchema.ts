import {z} from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be 6 characters or greater")
});

export type LoginSchema = z.infer<typeof loginSchema>;