import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    time:        String,
    label:       String,
    title:       { type: String, required: true },
    description: String,
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url:      { type: String, required: true },  // full URL: http://localhost:5000/uploads/packages/filename.jpg
    filename: { type: String, default: "" },     // disk filename — used for deletion
    caption:  { type: String, default: "" },
    order:    { type: Number, default: 0 },
  },
  { _id: true }
);

const packageSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, index: true },
    category: {
      type: String,
      enum: [
        "Spiritual","Family","Honeymoon","Weekend","Heritage","Nature",
        "Adventure","Food & Culture","Culture","Student","Corporate",
        "Wellness","Luxury","International",
      ],
      required: true,
    },
    district:      { type: mongoose.Schema.Types.ObjectId, ref: "District" },
    locationLabel: { type: String, required: true },
    durationDays:  { type: Number, required: true, default: 1 },
    priceFrom:     { type: Number, required: true },
    currency:      { type: String, default: "INR" },
    rating:        { type: Number, min: 0, max: 5, default: 4.5 },
    tagline:       { type: String },
    description:   { type: String },
    heroImage:     { type: String },  // always mirrors images[0].url
    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: v => v.length <= 5,
        message: "A package can have at most 5 images",
      },
    },
    highlights:    [{ type: String }],
    stops:         [stopSchema],
    inclusions:    [{ type: String }],
    exclusions:    [{ type: String }],
    faqs:          [{ question: String, answer: String }],
    featured:      { type: Boolean, default: false },
    isPublished:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

packageSchema.index({ title: "text", locationLabel: "text" });

export default mongoose.model("Package", packageSchema);
