import mongoose from "mongoose";

const AdminFeedSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    content: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["poll", "post"],
      default: "post",
      index: true,
    },

    level: {
      type: String,
      enum: ["Low", "Urgent", "Normal", "Emergency"],
      default: "Normal",
      index: true,
    },

    verifiedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    options: {
      type: [String],
      default: undefined,
      validate: {
        validator: function (v) {
          if (this.type === "poll") {
            return Array.isArray(v) && v.length >= 2;
          }
          return true;
        },
        message: "Poll must have at least 2 options",
      },
    },

    votes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        optionIndex: {
          type: Number,
          required: true,
        },
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    linkedIssueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

AdminFeedSchema.index({ type: 1, level: 1 });
AdminFeedSchema.index({ "votes.userId": 1 });

const AdminFeed =
  mongoose.models.AdminFeed || mongoose.model("AdminFeed", AdminFeedSchema);

export default AdminFeed;
