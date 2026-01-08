import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function GET() {
  try {
    await connectDB();

    const issues = await Issues.find({
      isArchived: false,
      status: { $ne: "rejected" },
    })
      .select("_id title priority status")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(
      issues.map((issue) => ({
        id: issue._id.toString(),
        title: issue.title,
        priority: issue.priority,
        status: issue.status,
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
