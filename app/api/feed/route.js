import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AdminFeed from "@/models/AdminFeed";
import { getServerSession } from "next-auth";
import "@/models/Issues";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession();
    const userId = session?.user?.id || null;

    const data = await AdminFeed.find()
      .populate("author", "name")
      .populate("linkedIssueId", "title priority status")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = data.map((item) => {
      let voteCounts = [];
      let userVote = null;

      if (item.type === "poll") {
        voteCounts = item.options.map(
          (_, idx) => item.votes.filter((v) => v.optionIndex === idx).length
        );

        if (userId) {
          const found = item.votes.find((v) => v.userId.toString() === userId);
          userVote = found ? found.optionIndex : null;
        }
      }

      return {
        id: item._id.toString(),

        author: item.author?.name || "Admin",
        role: "Admin",

        content: item.content,
        type: item.type,
        level: item.level,

        verifiedCount: item.verifiedBy?.length || 0,
        likes: item.likes?.length || 0,
        dislikes: item.dislikes?.length || 0,

        hasLiked: userId
          ? item.likes.some((id) => id.toString() === userId)
          : false,
        hasDisliked: userId
          ? item.dislikes.some((id) => id.toString() === userId)
          : false,
        hasVerified: userId
          ? item.verifiedBy.some((v) => v.userId.toString() === userId)
          : false,

        options: item.options || [],
        votes: voteCounts,
        userVote,

        linkedIssue: item.linkedIssueId
          ? {
              id: item.linkedIssueId._id.toString(),
              title: item.linkedIssueId.title,
              priority: item.linkedIssueId.priority,
              status: item.linkedIssueId.status,
            }
          : null,

        timestamp: new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("CITIZEN FEED ERROR:", err);
    return NextResponse.json([], { status: 200 }); // ALWAYS ARRAY
  }
}
