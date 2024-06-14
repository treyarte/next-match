import {z} from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be 6 characters or greater")
});

export type RegisterSchema = z.infer<typeof registerSchema>;