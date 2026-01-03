import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  // 🔥 NORMALIZE INPUT (IMPORTANT)
  const title = body.title?.trim();
  const description =
    body.description?.trim() ||
    (body.voiceNote
      ? "Issue reported via voice note"
      : "");

  if (!title || !description || !body.category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const issue = await Issues.create({
    title,
    description,
    category: body.category,
    priority: body.priority || "Medium",
    location: body.location,
    images: body.images || [],
    voiceNote: body.voiceNote || "",
    reportedBy: session.user.id,
  });

  return NextResponse.json({ success: true, issue }, { status: 201 });
}
