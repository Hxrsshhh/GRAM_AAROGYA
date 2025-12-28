import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).select(
    "name email avatar phone address bio"
  );
  console.log(user);

  return NextResponse.json(user);
}




export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Safety check for session
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, bio } = body;

    await connectDB();

    // Use findByIdAndUpdate for Mongoose instead of prisma.user.update
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        $set: { 
          name, 
          phone, 
          address, 
          bio 
          // Email is excluded here for security
        } 
      },
      { new: true, runValidators: true } // 'new: true' returns the modified document
    ).select("name email avatar phone address bio");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Update failed" }, 
      { status: 500 }
    );
  }
}