import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { status, profile } = body;

  await connectDB();

  await User.findByIdAndUpdate(session.user.id, {
  onboardingStatus: status,
  ...(profile && {
    username: profile.username,
    phone: profile.phone,
    bio: profile.bio,
    avatar: profile.avatar,
    location: {
      city: profile.city,
      state: profile.state,
      country: "India", 
    },
  }),
});

  return NextResponse.json({ success: true });
}
