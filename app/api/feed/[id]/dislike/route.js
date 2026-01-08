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

    const feed = await AdminFeed.findOne({
      _id: id,
      dislikes: userId,
    });

    let update;

    if (feed) {
      update = {
        $pull: { dislikes: userId },
      };
    } else {
      update = {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      };
    }

    const updated = await AdminFeed.findByIdAndUpdate(id, update, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      dislikes: updated.dislikes.length,
      likes: updated.likes.length,
      hasDisliked: !feed,
    });
  } catch (err) {
    console.error("DISLIKE TOGGLE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to toggle dislike" },
      { status: 500 }
    );
  }
}
