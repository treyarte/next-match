import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prisma } from "./libs/prisma"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({token, session}) {
      if(token.sub && session.user) {
        session.user.id = token.sub
      }
      return session;
    }
  }
})