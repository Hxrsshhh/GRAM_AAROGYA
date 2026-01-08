import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import AdminFeed from "@/models/AdminFeed";
import { connect } from "mongoose";

export async function POST(req) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Only admins can post or create polls" },
      { status: 403 }
    );
  }

  const { content, type, level, options, linkedIssueId } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (type === "poll" && (!options || options.length < 2)) {
    return NextResponse.json(
      { error: "Poll must have at least 2 options" },
      { status: 400 }
    );
  }

  const post = await AdminFeed.create({
    author: session.user.id,
    role: "admin",
    content,
    type,
    level,
    options: type === "poll" ? options : [],
    linkedIssueId,
  });

  return NextResponse.json(post, { status: 201 });
}

export async function GET() {
  try {
    await connectDB();

    const data = await AdminFeed.find()
      .populate("author", "name role")
      .populate("verifiedBy.userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = data.map((item) => {
      let voteCounts = [];
      if (item.type === "poll") {
        voteCounts = item.options.map(
          (_, idx) => item.votes.filter((v) => v.optionIndex === idx).length
        );
      }

      return {
        id: item._id.toString(),
        author: item.author?.name || "ADMIN",
        role: "Admin",
        content: item.content,
        type: item.type,
        level: item.level,

        verifiedCount: item.verifiedBy?.length || 0,
        likes: item.likes?.length || 0,
        dislikes: item.dislikes?.length || 0,

        options: item.options || [],
        votes: voteCounts,

        userVote: 0,
        voted: false,

        linkedIssueId: item.linkedIssueId
          ? item.linkedIssueId.toString()
          : null,

        timestamp: new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("ADMIN FEED ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load admin feed" },
      { status: 500 }
    );
  }
}
