import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    upvotes: {
      type: Number,
      default: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: String,
      enum: ["public", "official"],
      default: "public",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

CommentSchema.index({ issue: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: 1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
