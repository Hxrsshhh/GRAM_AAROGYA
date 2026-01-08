import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminFeed from "@/models/AdminFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const alreadyLiked = await AdminFeed.exists({
      _id: id,
      likes: userId,
    });

    let update;

    if (alreadyLiked) {
      update = {
        $pull: { likes: userId },
      };
    } else {
      update = {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      };
    }

    const updated = await AdminFeed.findByIdAndUpdate(id, update, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      likes: updated.likes.length,
      dislikes: updated.dislikes.length,
      hasLiked: !alreadyLiked,
    });
  } catch (err) {
    console.error("LIKE TOGGLE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
