import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Package from "../models/Package.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the public URL path for a stored file
function fileUrl(req, filename) {
  const base = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/packages/${filename}`;
}

// Delete a file from disk safely
function removeFile(filename) {
  if (!filename) return;
  const filePath = path.join(__dirname, "../../uploads/packages", path.basename(filename));
  try { fs.unlinkSync(filePath); } catch {}
}

/**
 * POST /api/packages/:id/images
 * Upload up to 5 images (multipart/form-data, field name: "images")
 */
export async function uploadPackageImages(req, res) {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    // Cleanup uploaded files if package not found
    req.files?.forEach(f => removeFile(f.filename));
    return res.status(404).json({ message: "Package not found" });
  }

  if (!req.files?.length)
    return res.status(400).json({ message: "No files uploaded" });

  const remaining = 5 - (pkg.images?.length || 0);
  if (remaining <= 0) {
    req.files.forEach(f => removeFile(f.filename));
    return res.status(400).json({ message: "Maximum 5 images already uploaded. Delete some first." });
  }

  const toAdd = req.files.slice(0, remaining);
  // Remove extras that don't fit
  req.files.slice(remaining).forEach(f => removeFile(f.filename));

  const newImages = toAdd.map((file, i) => ({
    url:      fileUrl(req, file.filename),
    filename: file.filename,      // stored for deletion later
    caption:  "",
    order:    (pkg.images?.length || 0) + i,
  }));

  pkg.images.push(...newImages);
  if (!pkg.heroImage && pkg.images.length > 0) pkg.heroImage = pkg.images[0].url;
  await pkg.save();

  res.status(201).json({
    message:   `${newImages.length} image(s) uploaded`,
    images:    pkg.images,
    heroImage: pkg.heroImage,
  });
}

/**
 * DELETE /api/packages/:id/images/:imageId
 */
export async function deletePackageImage(req, res) {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });

  const img = pkg.images.id(req.params.imageId);
  if (!img) return res.status(404).json({ message: "Image not found" });

  // Remove file from disk
  removeFile(img.filename || path.basename(img.url));

  img.deleteOne();
  pkg.heroImage = pkg.images.length > 0 ? pkg.images[0].url : "";
  await pkg.save();

  res.json({ message: "Image deleted", images: pkg.images, heroImage: pkg.heroImage });
}

/**
 * PATCH /api/packages/:id/images/:imageId
 * Update caption / order / set as hero
 */
export async function updatePackageImage(req, res) {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });

  const img = pkg.images.id(req.params.imageId);
  if (!img) return res.status(404).json({ message: "Image not found" });

  if (req.body.caption !== undefined) img.caption = req.body.caption;
  if (req.body.order   !== undefined) img.order   = Number(req.body.order);
  if (req.body.setHero)               pkg.heroImage = img.url;

  // Re-sort by order after update
  pkg.images.sort((a, b) => a.order - b.order);
  await pkg.save();

  res.json({ message: "Image updated", images: pkg.images, heroImage: pkg.heroImage });
}
