import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Announcement text is required"],
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      default: "/packages",
    },
    badge: {
      type: String,
      trim: true,
      default: "Highlights",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    startAt: {
      type: Date,
      default: null,
    },
    endAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

announcementSchema.index({ isActive: 1, order: 1 });

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
