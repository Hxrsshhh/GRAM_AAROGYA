export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Issue ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const issue = await Issues.findById(id)
      .populate("reportedBy", "name email images role")
      .populate("resolvedBy", "name role");

    if (!issue) {
      return NextResponse.json(
        { success: false, message: "Issue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, issue: issue }, { status: 200 });
  } catch (error) {
    console.error("GET /api/issues/[id] error:", error);

    return NextResponse.json(
      { success: false, message: "Invalid issue ID" },
      { status: 500 }
    );
  }
}
