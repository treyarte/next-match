import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prisma } from "./libs/prisma"
import { Role } from "@prisma/client"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({token, user, trigger, session}) {
      if(user) {
        token.profileComplete = user.profileComplete;
        token.role = user.role
      }
      if(trigger === "update") { //important to update the nav bar
        return {...token, ...session.user}
      }
      return {...token, ...user}
    },

    async session({token, session, trigger, user}) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
        session.user.profileComplete = token.profileComplete as boolean;
        session.user.role = token.role as Role;
      }
      return session;
    }
  }
}) 