import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    source: {
      type: String,
      enum: ["plan-my-trip", "package-enquiry", "district-enquiry", "contact-form", "whatsapp"],
      default: "plan-my-trip",
    },
    originCity: String,
    destination: String,
    packageRef: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    districtRef: { type: mongoose.Schema.Types.ObjectId, ref: "District" },
    travelDate: Date,
    travellers: { type: Number, default: 1 },
    budgetTier: { type: String, enum: ["value", "mid", "luxury"], default: "mid" },
    interests: [{ type: String }],
    stayPreference: { type: String },
    transportPreference: { type: String },
    specialRequirements: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ["new", "contacted", "proposal_sent", "confirmed", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
