import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";
Issues;

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await connectDB();

  const issue = await Issues.create({
    title: body.title,
    description: body.description,
    category: body.category,
    priority: body.priority,
    location: body.location,
    images: body.images,
    voiceNote: body.voiceNote,
    reportedBy: session.user.id,
  });

  return NextResponse.json({ success: true, issue });
}
