import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Issues from "@/models/Issues";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const userId = session.user.id;

  await Issues.deleteMany({ reportedBy: userId });

  await Issues.updateMany(
    {},
    {
      $pull: {
        upvotedBy: userId,
        comments: { createdBy: userId },
      },
    }
  );

  await User.findByIdAndDelete(userId);

  return NextResponse.json({
    success: true,
    message: "Account deleted successfully",
  });
}
