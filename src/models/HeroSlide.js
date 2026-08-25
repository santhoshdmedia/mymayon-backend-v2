import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },

    ctaText: { type: String, trim: true, default: "" }, // e.g. "Explore Packages"
    ctaLink: { type: String, trim: true, default: "" }, // e.g. "/packages" or full URL

    image: {
      url: { type: String, default: "" }, // full URL: http://localhost:5000/uploads/hero/filename.jpg
      filename: { type: String, default: "" }, // stored disk filename — used for deletion
    },

    order: { type: Number, default: 0 }, // display order, ascending
    isActive: { type: Boolean, default: true }, // admin on/off switch

    // ── Scheduling window ────────────────────────────────────────────────
    // Slide only appears in the public rotation between startAt and endAt
    // (both optional — leave empty for "always on" once isActive is true).
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },

    // ── Countdown timer ──────────────────────────────────────────────────
    // If countdownTarget is set, the frontend shows a live "time remaining"
    // timer on this slide, counting down to this date/time.
    countdownTarget: { type: Date, default: null },
    countdownLabel: { type: String, trim: true, default: "Offer ends in" },
  },
  { timestamps: true }
);

heroSlideSchema.index({ order: 1 });

// Virtual: is this slide currently within its scheduled window?
heroSlideSchema.methods.isLive = function (now = new Date()) {
  if (!this.isActive) return false;
  if (this.startAt && now < this.startAt) return false;
  if (this.endAt && now > this.endAt) return false;
  return true;
};

export default mongoose.model("HeroSlide", heroSlideSchema);
