import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Issues from "@/models/Issues";
import mongoose from "mongoose"; // Add this for ObjectId conversion

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.id;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // 1. Delete user's content (Issues) if you still want them gone
    await Issues.deleteMany({ reportedBy: objectId });

    // 2. Remove traces from other issues
    await Issues.updateMany(
      {},
      {
        $pull: {
          upvotedBy: objectId,
          "comments": { createdBy: objectId },
        },
      }
    );

    // 3. CHANGE: Instead of deleting, UPDATE the status
    await User.findByIdAndUpdate(userId, {
      $set: { 
        status: 'deleted',
        deletedAt: new Date() 
      }
    });

    const response = NextResponse.json({
      success: true,
      message: "Account status set to deleted",
    });

    // Clear session cookies so they are logged out
    const cookieOptions = { maxAge: 0, path: "/" };
    response.cookies.set("next-auth.session-token", "", cookieOptions);
    response.cookies.set("__Secure-next-auth.session-token", "", cookieOptions);

    return response;
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}