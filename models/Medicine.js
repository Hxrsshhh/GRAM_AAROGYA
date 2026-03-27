import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    composition: String,
    uses: [String],
    dosage: String,
    sideEffects: [String],
    warnings: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Medicine ||
  mongoose.model("Medicine", MedicineSchema);