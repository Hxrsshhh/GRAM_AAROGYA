import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { text } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedIssue = await Issues.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            text: text,
            createdBy: session.user.id || session.user._id,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const issue = await Issues.findById(id).populate({
      path: "comments.createdBy",
      select: "name avatar",
    });

    if (!issue) {
      return NextResponse.json(
        { success: false, message: "Issue not found" },
        { status: 404 }
      );
    }

    const sortedComments = issue.comments.sort(
      (a, b) => b.createdAt - a.createdAt
    );

    return NextResponse.json(
      {
        success: true,
        comments: sortedComments,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
