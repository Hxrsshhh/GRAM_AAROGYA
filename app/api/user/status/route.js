import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        status: "active",
        onboardingStatus: "pending",
      });
    }

    await connectDB();

    const user = await User.findById(id).select(
      "status onboardingStatus"
    );

    if (!user) {
      return NextResponse.json({
        status: "deleted",
        onboardingStatus: "pending",
      });
    }

    return NextResponse.json({
      status: user.status || "active",
      onboardingStatus: user.onboardingStatus || "pending",
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: "active",
        onboardingStatus: "pending",
      },
      { status: 500 }
    );
  }
}