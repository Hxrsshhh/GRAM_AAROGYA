import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const IssueSchema = new mongoose.Schema(
  {
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
        type: String,
      },
    },

    images: {
      type: [String],
      default: [],
    },

    voiceNote: {
      type: String,
      default: "",
    },

    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      index: true,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

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
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

IssueSchema.index({
  category: 1,
  status: 1,
  priority: 1,
});

IssueSchema.index({
  "location.lat": 1,
  "location.lng": 1,
});

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
