import { Router } from "express";
import {
  listPublicAnnouncements,
  listAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  reorderAnnouncements,
} from "../controllers/announcementController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

// Public
router.get("/", listPublicAnnouncements);

// Admin
router.get("/all", protect, requireRole("super_admin", "editor"), listAllAnnouncements);
router.patch("/reorder", protect, requireRole("super_admin", "editor"), reorderAnnouncements);
router.post("/", protect, requireRole("super_admin", "editor"), createAnnouncement);
router.put("/:id", protect, requireRole("super_admin", "editor"), updateAnnouncement);
router.delete("/:id", protect, requireRole("super_admin"), deleteAnnouncement);

export default router;
