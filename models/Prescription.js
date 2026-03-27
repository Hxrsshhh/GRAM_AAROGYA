import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    userId: String,
    extractedText: String,
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        timing: String,
        duration: String,
        use: String,
        instructions: String,
        confidenceScore: Number,
        isEstimated: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ||
  mongoose.model("Prescription", PrescriptionSchema);