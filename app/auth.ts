import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
const ALLOWED_EMAILS = process.env.ALLOWED_EMAILS?.split(',') || []
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!ALLOWED_EMAILS.includes(user.email || '')) {
        return false
      }
      return true
    },
  },
})