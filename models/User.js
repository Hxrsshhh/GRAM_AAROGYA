import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    username: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    avatar: {
      type: String,
      default: "/avatar.jpg",
    },
    bio: {
      type: String,
      default: null,
    },

    // 🔐 Auth
    password: {
      type: String,
      select: false,
    },
    authProviders: [
      {
        provider: String,
        providerId: String,
      },
    ],

    // 📞 Contact
    phone: {
      type: String,
      default: null,
    },
    emergencyContact: {
      type: String,
      default: null,
    },

    // 📍 Location
    location: {
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: "India",
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // 🩺 Health Profile (🔥 NEW CORE FEATURE)
    healthProfile: {
      age: Number,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
      conditions: [String], // Diabetes, BP, etc.
      allergies: String,
    },

    // ⚙️ Preferences
    preferences: {
      interests: [String], // Fitness, Mental Health, etc.
      doctorPreference: {
        type: String,
        enum: ["General", "Specialist"],
        default: "General",
      },
    },

    // 🛡️ Safety
    consent: {
      type: Boolean,
      default: false,
    },

    // 📊 System
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // 📈 Engagement
    reputation: {
      type: Number,
      default: 0,
    },
    reportsCount: {
      type: Number,
      default: 0,
    },
    upvotesGiven: {
      type: Number,
      default: 0,
    },

    // 🚀 Onboarding
    onboardingStatus: {
      type: String,
      enum: ["pending", "skipped", "completed"],
      default: "pending",
    },

    // ⏱️ Activity
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);