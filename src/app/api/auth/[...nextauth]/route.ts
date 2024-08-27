import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak"

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KC_CLIENT_ID,
      clientSecret: process.env.KC_CLIENT_SECRET,
      issuer: process.env.KC_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email",
          response_type: "code",
          code_challenge_method: "S256"
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 30
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken      = account.id_token
        token.accessToken  = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt    = account.expires_at
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.error       = token.error
      return session
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }