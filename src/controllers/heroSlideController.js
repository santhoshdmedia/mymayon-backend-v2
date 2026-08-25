import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import HeroSlide from "../models/HeroSlide.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fileUrl(req, filename) {
  const base = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/hero/${filename}`;
}

function removeFile(filename) {
  if (!filename) return;
  const filePath = path.join(__dirname, "../../uploads/hero", path.basename(filename));
  try { fs.unlinkSync(filePath); } catch {}
}

/**
 * GET /api/hero-slides
 * Public — only slides that are active AND within their scheduled window,
 * sorted for display order. This is what the homepage slider consumes.
 */
export async function listPublicHeroSlides(req, res) {
  const now = new Date();
  const slides = await HeroSlide.find({
    isActive: true,
    $and: [
      { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
      { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
    ],
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  res.json({ data: slides });
}

/**
 * GET /api/hero-slides/all
 * Admin — every slide regardless of active/schedule state, for management.
 */
export async function listAllHeroSlides(req, res) {
  const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: 1 }).lean();
  res.json({ data: slides });
}

export async function getHeroSlide(req, res) {
  const slide = await HeroSlide.findById(req.params.id).lean();
  if (!slide) return res.status(404).json({ message: "Slide not found" });
  res.json({ data: slide });
}

export async function createHeroSlide(req, res) {
  // Default new slides to the end of the order
  if (req.body.order === undefined) {
    const last = await HeroSlide.findOne({}).sort({ order: -1 }).lean();
    req.body.order = last ? last.order + 1 : 0;
  }
  const slide = await HeroSlide.create(req.body);
  res.status(201).json({ data: slide });
}

export async function updateHeroSlide(req, res) {
  const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!slide) return res.status(404).json({ message: "Slide not found" });
  res.json({ data: slide });
}

export async function deleteHeroSlide(req, res) {
  const slide = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!slide) return res.status(404).json({ message: "Slide not found" });
  removeFile(slide.image?.filename);
  res.json({ message: "Slide deleted" });
}

/**
 * PATCH /api/hero-slides/reorder
 * Body: { order: [{ id, order }, ...] }
 */
export async function reorderHeroSlides(req, res) {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: "order must be an array of { id, order }" });
  }
  await Promise.all(
    order.map(({ id, order: o }) => HeroSlide.findByIdAndUpdate(id, { order: o }))
  );
  const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: 1 }).lean();
  res.json({ data: slides });
}

/**
 * POST /api/hero-slides/:id/image
 * Single-image upload (multipart/form-data, field name: "image")
 */
export async function uploadHeroSlideImage(req, res) {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) {
    if (req.file) removeFile(req.file.filename);
    return res.status(404).json({ message: "Slide not found" });
  }
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // Replace any existing image
  removeFile(slide.image?.filename);

  slide.image = { url: fileUrl(req, req.file.filename), filename: req.file.filename };
  await slide.save();

  res.status(201).json({ message: "Image uploaded", data: slide });
}

/**
 * DELETE /api/hero-slides/:id/image
 */
export async function deleteHeroSlideImage(req, res) {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return res.status(404).json({ message: "Slide not found" });

  removeFile(slide.image?.filename);
  slide.image = { url: "", filename: "" };
  await slide.save();

  res.json({ message: "Image removed", data: slide });
}
