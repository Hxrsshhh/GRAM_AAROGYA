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
    const { optionIndex } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const post = await AdminFeed.findById(id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const existingVote = post.votes.find(
      (v) => v.userId.toString() === userId.toString()
    );

    let updateQuery;

    if (existingVote) {
      if (existingVote.optionIndex === optionIndex) {
        updateQuery = { $pull: { votes: { userId } } };
      } else {
        return await handleSwitchVote(id, userId, optionIndex);
      }
    } else {
      updateQuery = { $push: { votes: { userId, optionIndex } } };
    }

    const updatedPost = await AdminFeed.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    return NextResponse.json(formatVoteResponse(updatedPost, userId));
  } catch (err) {
    console.error("POLL VOTE ERROR:", err);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

async function handleSwitchVote(postId, userId, newIndex) {
  const updated = await AdminFeed.findOneAndUpdate(
    { _id: postId, "votes.userId": userId },
    { $set: { "votes.$.optionIndex": newIndex } },
    { new: true }
  );
  return NextResponse.json(formatVoteResponse(updated, userId));
}

function formatVoteResponse(post, userId) {
  const counts = post.options.map(
    (_, idx) => post.votes.filter((v) => v.optionIndex === idx).length
  );

  return {
    success: true,
    votes: counts,
    userChoice:
      post.votes.find((v) => v.userId.toString() === userId.toString())
        ?.optionIndex ?? null,
  };
}
