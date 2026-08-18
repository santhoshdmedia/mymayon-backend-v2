import Package from "../models/Package.js";

export async function listPackages(req, res) {
  const { category, featured, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured) filter.featured = featured === "true";
  if (search)   filter.$or = [
    { title:         { $regex: search, $options: "i" } },
    { locationLabel: { $regex: search, $options: "i" } },
  ];

  const skip  = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Package.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Package.countDocuments(filter),
  ]);
  res.json({ total, page: Number(page), data });
}

export async function getPackage(req, res) {
  const pkg = await Package.findOne({ slug: req.params.slug }).lean();
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json({ data: pkg });
}

export async function createPackage(req, res) {
  const pkg = await Package.create(req.body);
  res.status(201).json({ data: pkg });
}

export async function updatePackage(req, res) {
  const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json({ data: pkg });
}

export async function deletePackage(req, res) {
  const pkg = await Package.findByIdAndDelete(req.params.id);
  if (!pkg) return res.status(404).json({ message: "Package not found" });
  res.json({ message: "Package deleted" });
}
