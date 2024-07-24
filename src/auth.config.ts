import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./app/schemas/loginSchema"
import { getUserByEmail } from "./repos/usersRepo";
import { compare } from "bcryptjs";
 
export default { 
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret:process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      async authorize(cred) {
        const validated = loginSchema.safeParse(cred);
        
        if(validated.success) {          
          const {email, password} = validated.data;
          
          const user = await getUserByEmail(email);
          
          if (!user || !user.passwordHash || !(await compare(password, user.passwordHash))) {
            return null;
          }
          
          return user;
        }

        return null;
      },
    },
  )
  ] 
} satisfies NextAuthConfig