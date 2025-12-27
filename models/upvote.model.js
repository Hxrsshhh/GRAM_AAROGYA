import mongoose from "mongoose";

const UpvoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    targetType: {
      type: String,
      enum: ["Issue", "Comment"],
      required: true,
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

UpvoteSchema.index(
  { user: 1, targetType: 1, targetId: 1 },
  { unique: true }
);

export default mongoose.models.Upvote || mongoose.model("Upvote", UpvoteSchema);
