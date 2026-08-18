import District from "../models/District.js";

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
  const district = await District.findByIdAndDelete(req.params.id);
  if (!district) return res.status(404).json({ message: "District not found" });
  res.json({ message: "District deleted" });
}
