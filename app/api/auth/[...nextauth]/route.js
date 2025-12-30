import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    // ---------------- GOOGLE ----------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "email public_profile",
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email, // ⚠️ may be null
          image: profile.picture?.data?.url ?? null,
        };
      },
    }),

    // ---------------- CREDENTIALS ----------------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      // authOptions
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) throw new Error("User not found");
        if (user.status !== "active") throw new Error("Account disabled");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          onboardingStatus: user.onboardingStatus,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account.provider === "credentials") {
        return true;
      }
      const email = user.email;
      if (!email) return false;

      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name || "New User",
          email,
          avatar: user.image,
          emailVerified: true,
          role: "citizen",
          status: "active",
          authProviders: [
            {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          ],
          lastLoginAt: new Date(),
        });
      } else {
        const isLinked = dbUser.authProviders.some(
          (p) =>
            p.provider === account.provider &&
            p.providerId === account.providerAccountId
        );

        if (!isLinked) {
          dbUser.authProviders.push({
            provider: account.provider,
            providerId: account.providerAccountId,
          });
        }

        dbUser.lastLoginAt = new Date();
        await dbUser.save();
      }

      user.id = dbUser._id.toString();
      user.role = dbUser.role;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      // Always sync onboardingStatus from DB
      if (token?.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).select("onboardingStatus");
        token.onboardingStatus = dbUser?.onboardingStatus || "pending";
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.onboardingStatus = token.onboardingStatus;

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
