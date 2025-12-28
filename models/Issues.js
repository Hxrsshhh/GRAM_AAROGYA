import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema(
  {
    /* ---------- CORE DETAILS ---------- */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "infrastructure",
        "utilities",
        "sanitation",
        "safety",
        "environment",
        "traffic",
        "other",
      ],
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
      index: true,
    },

    /* ---------- STATUS LIFECYCLE ---------- */
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    /* ---------- LOCATION ---------- */
    location: {
      address: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      coordinates: {
        type: String, // "12.9716, 77.5946" (optional but useful)
      },
    },

    /* ---------- MEDIA ---------- */
    images: {
      type: [String], // Firebase image URLs
      default: [],
    },

    voiceNote: {
      type: String, // Firebase audio URL
      default: "",
    },

    /* ---------- ENGAGEMENT ---------- */
    upvotes: {
      type: Number,
      default: 0,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    /* ---------- AUDIT / OWNERSHIP ---------- */
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resolvedAt: {
      type: Date,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* ---------- COMPOUND INDEXES ---------- */
IssueSchema.index({
  category: 1,
  status: 1,
  priority: 1,
});

IssueSchema.index({
  "location.lat": 1,
  "location.lng": 1,
});

export default mongoose.models.Issue ||
  mongoose.model("Issue", IssueSchema);
