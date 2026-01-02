import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function GET(request) {
  try {
    await connectDB();

    const issues = await Issues.find({})
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 }); 

    return NextResponse.json(
      {
        success: true,
        count: issues.length,
        data: issues,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/issues error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
