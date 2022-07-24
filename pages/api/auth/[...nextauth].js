import NextAuth from "next-auth";

const {
  MONZO_CLIENT_ID: clientId,
  MONZO_CLIENT_SECRET: clientSecret,
  NEXTAUTH_URL,
  KIERAN_MONZO,
} = process.env;

const NJS_MONZO_REDIRECT = `${NEXTAUTH_URL}/api/auth/callback/monzo`;

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: "monzo",
      name: "Monzo",
      type: "oauth",
      version: "2.0",
      accessTokenUrl: "https://api.monzo.com/oauth2/token",
      params: {
        grant_type: "authorization_code",
        redirect_uri: NJS_MONZO_REDIRECT,
      },
      authorizationUrl: "https://auth.monzo.com",
      authorizationParams: {
        client_id: clientId,
        redirect_uri: NJS_MONZO_REDIRECT,
        response_type: "code",
      },
      profileUrl: "https://api.monzo.com/ping/whoami",
      profile: (profile) => {
        const result = {
          id: profile.user_id,
          name: profile.user_id,
          email: "test@email.com",
          image: "http://example.com/",
        };
        return result;
      },
      clientId,
      clientSecret,
    },
  ],
  callbacks: {
    async signIn(user) {
      return user.id === KIERAN_MONZO;
    },
    async jwt(token) {
      return token;
    },
    async session(session) {
      return session;
    },
  },
  debug: false,
});
