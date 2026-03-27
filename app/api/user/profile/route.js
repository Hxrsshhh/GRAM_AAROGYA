import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Fields we want to expose to the client
const PROFILE_FIELDS = 
  "name email avatar bio phone emergencyContact location healthProfile role isVerified reputation reportsCount onboardingStatus";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  
  const user = await User.findById(session.user.id).select(PROFILE_FIELDS);
  
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Destructure the new medical and contact fields
    const { 
      name, 
      phone, 
      emergencyContact, 
      location, 
      bio, 
      healthProfile 
    } = body;

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name,
          phone,
          emergencyContact,
          bio,
          // Handle nested location
          "location.city": location?.city,
          "location.state": location?.state,
          "location.country": location?.country,
          // Handle nested health profile
          "healthProfile.age": healthProfile?.age,
          "healthProfile.gender": healthProfile?.gender,
          "healthProfile.conditions": healthProfile?.conditions,
          "healthProfile.allergies": healthProfile?.allergies,
        },
      },
      { 
        new: true, 
        runValidators: true // Crucial to ensure enum values (Gender/Role) are valid
      }
    ).select(PROFILE_FIELDS);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Identity synchronization failed" },
      { status: 500 }
    );
  }
}