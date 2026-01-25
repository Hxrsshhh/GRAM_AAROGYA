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

      if (account.provider === "credentials") {
        if (user.status === "blocked") {
          return `/auth/error?error=ACCESS_DENIED_BLOCKED`;
        }

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
       
        if (dbUser.status === "blocked") {
          throw new Error("ACCESS_DENIED_BLOCKED"); 
        }
        if (dbUser.status === "deleted") {
          throw new Error("ACCESS_DENIED_DELETED"); 
        }
      

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
      user.status = dbUser.status; 

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
        if (
          !dbUser ||
          dbUser.status === "blocked" ||
          dbUser.status === "deleted"
        ) {
          return null; 
        }
        token.onboardingStatus = dbUser?.onboardingStatus || "pending";
        token.status = dbUser?.status;
      }
      return token;
    },

    async session({ session, token }) {
      if (!token) return null;

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.onboardingStatus = token.onboardingStatus;
      session.user.status = token.status;

      if (token.status === "blocked") {
        return null; 
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
