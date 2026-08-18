import Enquiry from "../models/Enquiry.js";

export async function createEnquiry(req, res) {
  const body = req.body;
  const payload = {
    fullName:   body.name || body.fullName || "Anonymous",
    phone:      body.phone,
    email:      body.email || "",
    source:     body.packageSlug ? "package-enquiry" : body.travelType === "Partner Enquiry" ? "contact-form" : "plan-my-trip",
    destination: body.destination || body.destinationName || "",
    travelDate:  body.travelDate ? new Date(body.travelDate) : undefined,
    travellers:  body.groupSize ? parseInt(body.groupSize) || 1 : 1,
    message:     body.message || "",
    specialRequirements: body.message || "",
    interests:   body.travelType ? [body.travelType] : [],
    status:      "new",
  };
  const enquiry = await Enquiry.create(payload);
  res.status(201).json({ message: "Enquiry received. We'll contact you within 24 hours.", data: enquiry });
}

export async function listEnquiries(req, res) {
  const { status, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { fullName: { $regex: search, $options: "i" } },
    { phone:    { $regex: search, $options: "i" } },
    { email:    { $regex: search, $options: "i" } },
  ];
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Enquiry.countDocuments(filter),
  ]);
  res.json({ total, page: Number(page), data });
}

export async function updateEnquiryStatus(req, res) {
  const { status, notes } = req.body;
  const update = { status };
  if (notes !== undefined) update.notes = notes;
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  res.json({ data: enquiry });
}

export async function deleteEnquiry(req, res) {
  await Enquiry.findByIdAndDelete(req.params.id);
  res.json({ message: "Enquiry deleted" });
}

export async function getStats(req, res) {
  const [total, newCount, contacted, converted, districts, packages] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments({ status: "contacted" }),
    Enquiry.countDocuments({ status: "converted" }),
    (await import("../models/District.js")).default.countDocuments(),
    (await import("../models/Package.js")).default.countDocuments(),
  ]);
  // Last 7 days trend
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentEnquiries = await Enquiry.find({ createdAt: { $gte: sevenDaysAgo } })
    .select("createdAt status").lean();
  res.json({ total, newCount, contacted, converted, districts, packages, recentEnquiries });
}
