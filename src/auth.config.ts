import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./app/schemas/loginSchema"
import { getUserByEmail } from "./repos/usersRepo";
import { compare } from "bcryptjs";
 
export default { 
  providers: [
    Credentials({
      name: 'credentials',
      async authorize(cred) {
        const validated = loginSchema.safeParse(cred);
        
        if(validated.success) {          
          const {email, password} = validated.data;
          
          const user = await getUserByEmail(email);
          
          if (!user || !(await compare(password, user.passwordHash))) {
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