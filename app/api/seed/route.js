import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";
// import { ISSUE_DETAILS } from "@/lib/issue-mock-data";
import {data} from "@/lib/issue-mock-data";

export async function POST() {
  try {
    await connectDB();

    const inserted = await Issues.insertOne(data);

    return NextResponse.json({
      success: true,
      count: inserted.length,
      message: "Issues seeded successfully",
    });
  } catch (error) {
    console.error("SEED ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
