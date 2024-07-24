import { z } from "zod";

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6)
}).refine((field) => field.password === field.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>