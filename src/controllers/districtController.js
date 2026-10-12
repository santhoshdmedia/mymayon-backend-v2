import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import District from "../models/District.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function removeDistrictFile(filename) {
  if (!filename) return;
  const filePath = path.join(__dirname, "../../uploads/districts", path.basename(filename));
  try { fs.unlinkSync(filePath); } catch {}
}

function fileUrl(req, filename) {
  const base = process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/districts/${filename}`;
}

export async function listDistricts(req, res) {
  const { region, featured, search, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (region)   filter.region   = region;
  if (featured) filter.featured = featured === "true";
  if (search)   filter.$or = [
    { name:            { $regex: search, $options: "i" } },
    { presidingDeity:  { $regex: search, $options: "i" } },
  ];

  const skip  = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    District.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)).lean(),
    District.countDocuments(filter),
  ]);
  res.json({ total, page: Number(page), data });
}

export async function getDistrict(req, res) {
  const district = await District.findOne({ slug: req.params.slug }).lean();
  if (!district) return res.status(404).json({ message: "District not found" });
  res.json({ data: district });
}

export async function createDistrict(req, res) {
  const district = await District.create(req.body);
  res.status(201).json({ data: district });
}

export async function updateDistrict(req, res) {
  const district = await District.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!district) return res.status(404).json({ message: "District not found" });
  res.json({ data: district });
}

export async function deleteDistrict(req, res) {
  const district = await District.findById(req.params.id);
  if (!district) return res.status(404).json({ message: "District not found" });

  if (district.imageFilename) {
    removeDistrictFile(district.imageFilename);
  }
  await district.deleteOne();
  res.json({ message: "District deleted" });
}

export async function uploadDistrictImage(req, res) {
  const district = await District.findById(req.params.id);
  if (!district) {
    if (req.file) removeDistrictFile(req.file.filename);
    return res.status(404).json({ message: "District not found" });
  }
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  if (district.imageFilename) {
    removeDistrictFile(district.imageFilename);
  }

  const url = fileUrl(req, req.file.filename);
  district.heroImage = url;
  district.coverImage = url;
  district.imageFilename = req.file.filename;
  await district.save();

  res.status(201).json({ message: "District cover image uploaded", data: district });
}

export async function deleteDistrictImage(req, res) {
  const district = await District.findById(req.params.id);
  if (!district) return res.status(404).json({ message: "District not found" });

  if (district.imageFilename) {
    removeDistrictFile(district.imageFilename);
  }
  district.heroImage = "";
  district.coverImage = "";
  district.imageFilename = "";
  await district.save();

  res.json({ message: "District cover image removed", data: district });
}
