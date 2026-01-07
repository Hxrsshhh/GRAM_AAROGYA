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
          email: profile.email,
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
          status: user.status,
          onboardingStatus: user.onboardingStatus,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      // 1. For credentials, you should handle the block check in your Authorize function,
      // but we can add a safety check here too if needed.
      if (account.provider === "credentials") {
        if (user.status === "blocked") {
          return `/auth/error?error=ACCESS_DENIED_BLOCKED`;
        }

        // If deleted, send to custom error page
        if (user.status === "deleted") {
          return `/auth/error?error=USER_DELETED`;
        }
         console.log("I am in credential provider ");
        return true;
      }

      const email = user.email;
      if (!email) return false;

      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        // New User Creation
        dbUser = await User.create({
          name: user.name || "New User",
          email,
          avatar: user.image,
          emailVerified: true,
          role: "citizen",
          status: "active", // Default status
          authProviders: [
            {
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          ],
          lastLoginAt: new Date(),
        });
      } else {
        // --- BLOCK/DELETE CHECK START ---
        // If the user exists, check if they are blocked or deleted
        if (dbUser.status === "blocked") {
          throw new Error("ACCESS_DENIED_BLOCKED"); // This stops the sign-in
        }
        if (dbUser.status === "deleted") {
          throw new Error("ACCESS_DENIED_DELETED"); // This stops the sign-in
        }
        // --- BLOCK/DELETE CHECK END ---

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
      user.status = dbUser.status; // Add status to the user object

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
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
      session.user.status = token.status;

      if (token.status === "blocked") {
        return null; // This destroys the session on the next request
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
