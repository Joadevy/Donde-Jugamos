/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import NextAuth, {type AuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from "@next-auth/prisma-adapter";

import {db} from "@/backend/db/db";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "customer",
        };
      },
    }),
  ],
  callbacks: {
    redirect({url, baseUrl}) {
      // Allows relative callback URLs
      const u = new URL(url.startsWith("http") ? url : baseUrl);
      const redirectUrl = u.searchParams.get("callbackUrl")!;

      if (redirectUrl) return redirectUrl;
      // Allows callback URLs on the same origin
      else if (new URL(url.startsWith("http") ? url : baseUrl).origin === baseUrl) return url;

      return baseUrl;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({token, user}) {
      return {...token, ...user};
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    async session({session, token}) {
      session.user.role = token.role;

      return session;
    },
  },

  pages: {
    signIn: "/signin",
    //signOut: "/auth/signout",
    //error: "/auth/error",
    //verifyRequest: "/auth/verify-request",
    //newUser: "/auth/new-user",
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
