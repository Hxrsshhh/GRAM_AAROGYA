export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function POST(request, { params }) {
  const { id } = params;

  try {
    await connectDB();

    const updatedIssue = await Issues.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true } // This returns the document AFTER the increment
    );

    return NextResponse.json({
      success: true,
      viewCount: updatedIssue.viewCount,
    });
  } catch (error) {
    console.error("View increment error:", error);
    return NextResponse.json(
      { message: "Failed to increment view" },
      { status: 500 }
    );
  }
}
