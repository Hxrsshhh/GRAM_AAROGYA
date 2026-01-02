import connectDB from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  await connectDB();

  const updates = await req.json();

  const updatedUser = await User.findByIdAndUpdate(params.id, updates, {
    new: true,
  });

  return Response.json({
    success: true,
    user: {
      _id: updatedUser._id,
      role: updatedUser.role,
      isBlocked: updatedUser.isBlocked,
      isVerified: updatedUser.isVerified,
      status: updatedUser.status,
    },
  });
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    if (session.user.id.toString() === userId.toString()) {
      return NextResponse.json(
        { error: "Admin cannot delete own account" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete another admin" },
        { status: 403 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
