import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  await connectDB();

  const users = await User.find().sort({ createdAt: -1 });

  const formattedUsers = users.map((u) => ({
    _id: u._id.toString(),
    username: u.username,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    phone: u.phone,
    bio: u.bio,
    role: u.role,
    status: u.status,
    reputation: u.reputation,
    reportsCount: u.reportsCount,
    upvotesGiven: u.upvotesGiven,
    location: u.location,
    isVerified: u.isVerified,
    isBlocked: u.isBlocked,
    onboardingStatus: u.onboardingStatus,
    joinedAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    authProviders: u.authProviders,
  }));

  return Response.json(formattedUsers);
}
