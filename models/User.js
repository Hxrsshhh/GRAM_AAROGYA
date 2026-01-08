import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
    phone: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
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
    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    providerId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["citizen", "admin"],
      default: "citizen",
    },
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
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    onboardingStatus: {
      type: String,
      enum: ["pending", "skipped", "completed"],
      default: "pending",
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
