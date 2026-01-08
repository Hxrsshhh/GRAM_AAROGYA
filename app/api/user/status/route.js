import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ status: "active" });

    await connectDB();
    const user = await User.findById(id).select("status");

    if (!user) {
      return NextResponse.json({ status: "deleted" });
    }

    return NextResponse.json({ status: user.status });
  } catch (error) {
    return NextResponse.json({ status: "active" }, { status: 500 });
  }
}
