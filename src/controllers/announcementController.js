import Announcement from "../models/Announcement.js";

// GET /api/announcements (public)
export const listPublicAnnouncements = async (_req, res, next) => {
  try {
    const now = new Date();
    const items = await Announcement.find({
      isActive: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ],
    }).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/announcements/all (admin)
export const listAllAnnouncements = async (_req, res, next) => {
  try {
    const items = await Announcement.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// POST /api/announcements
export const createAnnouncement = async (req, res, next) => {
  try {
    const count = await Announcement.countDocuments();
    const item = await Announcement.create({
      ...req.body,
      order: count,
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// PUT /api/announcements/:id
export const updateAnnouncement = async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Announcement not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const item = await Announcement.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Announcement not found" });
    res.json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/announcements/reorder
export const reorderAnnouncements = async (req, res, next) => {
  try {
    const { order } = req.body; // [{ id, order }]
    if (!Array.isArray(order)) return res.status(400).json({ message: "Invalid order array" });
    await Promise.all(order.map(({ id, order: o }) => Announcement.findByIdAndUpdate(id, { order: o })));
    res.json({ success: true, message: "Reordered successfully" });
  } catch (err) {
    next(err);
  }
};
