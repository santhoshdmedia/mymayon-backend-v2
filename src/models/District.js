import mongoose from "mongoose";

const districtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    tamilName: { type: String, trim: true },
    region: {
      type: String,
      enum: ["Northern", "Western", "Central", "Southern", "Delta"],
      required: true,
    },
    presidingDeity: { type: String, required: true },
    faithCategories: [{ type: String, enum: ["Hindu", "Christian", "Islamic", "Buddhist", "Jain", "Interfaith"] }],
    circuits: [{ type: String }], // e.g. "Arupadai Veedu", "Navagraha"
    templeCount: { type: Number, default: 0 },
    idealSeason: { type: String },
    overview: { type: String },
    highlights: [{ type: String }],
    heroImage: { type: String },
    gallery: [{ type: String }],
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

districtSchema.index({ name: "text", presidingDeity: "text", overview: "text" });

export default mongoose.model("District", districtSchema);
