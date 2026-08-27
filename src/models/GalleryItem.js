import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Spiritual & Temples",
        "Heritage & History",
        "Nature & Hills",
        "Coastal & Beaches",
        "Culture & Festivals",
        "Cuisine & Trails",
      ],
      default: "Spiritual & Temples",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, default: null },
    },
    packageSlug: {
      type: String,
      trim: true,
      default: "",
    },
    districtSlug: {
      type: String,
      trim: true,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

galleryItemSchema.index({ category: 1, isActive: 1, order: 1 });

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
export default GalleryItem;
