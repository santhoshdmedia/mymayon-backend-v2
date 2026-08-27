import GalleryItem from "../models/GalleryItem.js";
import fs from "fs";
import path from "path";
import { GALLERY_UPLOAD_DIR_PATH } from "../config/multer.js";

// GET /api/gallery (public)
export const listPublicGallery = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tag: { $regex: search, $options: "i" } },
      ];
    }

    const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/gallery/all (admin)
export const listAllGallery = async (_req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/gallery/:id
export const getGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// POST /api/gallery
export const createGalleryItem = async (req, res, next) => {
  try {
    const count = await GalleryItem.countDocuments();
    const item = await GalleryItem.create({
      ...req.body,
      order: count,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// PUT /api/gallery/:id
export const updateGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/gallery/:id
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });

    // Clean up local image file if stored locally
    if (item.image?.url && item.image.url.includes("/uploads/gallery/")) {
      const filename = path.basename(item.image.url);
      const filePath = path.join(GALLERY_UPLOAD_DIR_PATH, filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }

    await GalleryItem.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Gallery photo deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/gallery/:id/image
export const uploadGalleryPhoto = async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const host = req.get("host");
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/gallery/${req.file.filename}`;

    // Clean up old image if stored locally
    if (item.image?.url && item.image.url.includes("/uploads/gallery/")) {
      const oldFilename = path.basename(item.image.url);
      const oldPath = path.join(GALLERY_UPLOAD_DIR_PATH, oldFilename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (_) {}
      }
    }

    item.image = { url, public_id: req.file.filename };
    await item.save();

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/gallery/:id/like (public like button)
export const likeGalleryPhoto = async (req, res, next) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.json({ success: true, likes: item.likes });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/gallery/reorder
export const reorderGallery = async (req, res, next) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ message: "Invalid order array" });
    await Promise.all(order.map(({ id, order: o }) => GalleryItem.findByIdAndUpdate(id, { order: o })));
    res.json({ success: true, message: "Reordered successfully" });
  } catch (err) {
    next(err);
  }
};
