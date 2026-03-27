import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🧵 Conversation grouping
    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    // 👤 Role (VERY IMPORTANT)
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    // 💬 Message content
    message: {
      type: String,
      required: true,
    },

    // 🧠 Embedding for semantic search
    embedding: {
      type: [Number],
      default: [],
    },

    // 🧾 Structured extraction (POWER FEATURE)
    extractedData: {
      symptoms: [String],
      medicines: [String],
      severity: String,
      duration: String,
    },

    // 🏷️ Tags for fast filtering
    tags: [String], // ["fever", "headache"]

    // 📊 AI metadata
    metadata: {
      model: String,
      tokensUsed: Number,
      confidence: Number,
    },

    // 📌 Summary (for long chats)
    summary: String,

    // ⚠️ Flag important messages
    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat =
  mongoose.models.Chat || mongoose.model("Chat", ChatSchema);