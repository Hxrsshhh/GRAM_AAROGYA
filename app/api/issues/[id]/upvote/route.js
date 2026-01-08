import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(request, context) {

  const { id } = await context.params;

  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    const issue = await Issues.findById(id);
    if (!issue) {
      return NextResponse.json({ message: "Issue not found" }, { status: 404 });
    }

    if (issue.reportedBy?.toString() === userId.toString()) {
      return NextResponse.json(
        { message: "Cannot upvote your own issue" },
        { status: 403 }
      );
    }

    const hasUpvoted = issue.upvotedBy.some(
      (uid) => uid.toString() === userId.toString()
    );

    if (hasUpvoted) {
      issue.upvotedBy.pull(userId);
      issue.upvotes = Math.max(issue.upvotes - 1, 0);
    } else {
      issue.upvotedBy.addToSet(userId);
      issue.upvotes += 1;
    }

    await issue.save();

    return NextResponse.json({
      upvotes: issue.upvotes,
      hasUpvoted: !hasUpvoted,
    });
  } catch (error) {
    console.error("Upvote route error:", error);
    return NextResponse.json(
      { message: "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
