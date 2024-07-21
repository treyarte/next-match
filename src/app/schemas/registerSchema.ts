import { calculateAge } from '@/libs/util';
import {z} from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be 6 characters or greater")
});

export const profileSchema = z.object({
  gender: z.string().min(1),
  description: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),  
  dateOfBirth: z.string().min(1).refine(dateStr => {
    const age = calculateAge(new Date(dateStr));
    return age >= 18
  },{
    message: "You must be 18 or older to use this app"
  })
})

export const combinedRegisterSchema = registerSchema.and(profileSchema);

 export type RegisterSchema = z.infer<typeof registerSchema & typeof profileSchema>;