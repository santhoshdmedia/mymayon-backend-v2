import Vendor from "../models/Vendor.js";

export async function registerVendor(req, res) {
  const vendor = await Vendor.create(req.body);
  res.status(201).json({
    message: "Registration received. Our partnerships team will review and get in touch.",
    data: vendor,
  });
}

export async function listVendors(req, res) {
  const { approvalStatus, category } = req.query;
  const filter = {};
  if (approvalStatus) filter.approvalStatus = approvalStatus;
  if (category) filter.category = category;
  const vendors = await Vendor.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ count: vendors.length, data: vendors });
}

export async function updateVendorStatus(req, res) {
  const { approvalStatus } = req.body;
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { approvalStatus }, { new: true });
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  res.json({ data: vendor });
}
