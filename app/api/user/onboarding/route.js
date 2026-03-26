import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    // ✅ 1. Always pass req to getServerSession in App Router
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ 2. Safe JSON parsing
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { status, profile } = body;

    // ✅ 3. Connect DB before any DB operation
    await connectDB();

    // ✅ 4. Build update object safely
    const updateData = {
      onboardingStatus: status || "pending",
    };

    if (profile && typeof profile === "object") {
      // 👤 Basic
      if (profile.username) updateData.username = profile.username;
      if (profile.avatar) updateData.avatar = profile.avatar;
      if (profile.bio) updateData.bio = profile.bio;

      // 📞 Contact
      if (profile.phone) updateData.phone = profile.phone;
      if (profile.emergencyContact) {
        updateData.emergencyContact = profile.emergencyContact;
      }

      // 📍 Location (avoid overwriting with empty)
      if (profile.city || profile.state || profile.pincode) {
        updateData.location = {
          city: profile.city || "",
          state: profile.state || "",
          pincode: profile.pincode || "",
          country: "India",
        };
      }

      // 🩺 Health Profile
      updateData.healthProfile = {
        age: profile.age ? Number(profile.age) : undefined,
        gender: profile.gender || undefined,
        conditions: Array.isArray(profile.conditions)
          ? profile.conditions
          : [],
        allergies: profile.allergies || "",
      };

      // ⚙️ Preferences
      updateData.preferences = {
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : [],
        doctorPreference: profile.doctorPreference || "General",
      };

      // 🛡️ Consent
      if (typeof profile.consent === "boolean") {
        updateData.consent = profile.consent;
      }
    }

    // ✅ 5. Ensure user exists
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData }, // 👈 important
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    return NextResponse.json(
      { error: "Failed to update onboarding" },
      { status: 500 }
    );
  }
}