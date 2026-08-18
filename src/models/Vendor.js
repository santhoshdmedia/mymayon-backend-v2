import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Hotel", "Guide", "Transport", "Photographer", "Experience Provider"],
      required: true,
    },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    serviceAreas: [{ type: String }], // district names
    licenseNumber: { type: String },
    documents: [{ type: String }], // uploaded file URLs
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifsc: String,
    },
    pricingNotes: { type: String },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
