import  connectDB  from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ status: "active" });

    await connectDB();
    const user = await User.findById(id).select("status");

    // CRITICAL CHANGE: 
    // If the user object is null, it means the account was deleted from the DB.
    if (!user) {
      return NextResponse.json({ status: "deleted" });
    }

    return NextResponse.json({ status: user.status });
  } catch (error) {
    // If there's a DB error, we default to active to prevent false lockouts
    return NextResponse.json({ status: "active" }, { status: 500 });
  }
}