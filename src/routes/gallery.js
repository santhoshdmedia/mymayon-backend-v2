import { Router } from "express";
import {
  listPublicGallery,
  listAllGallery,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadGalleryPhoto,
  likeGalleryPhoto,
  reorderGallery,
} from "../controllers/galleryController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadGallery } from "../config/multer.js";

const router = Router();

// Public
router.get("/", listPublicGallery);
router.patch("/:id/like", likeGalleryPhoto);

// Admin
router.get("/all", protect, requireRole("super_admin", "editor"), listAllGallery);
router.patch("/reorder", protect, requireRole("super_admin", "editor"), reorderGallery);
router.get("/:id", protect, requireRole("super_admin", "editor"), getGalleryItem);

router.post("/", protect, requireRole("super_admin", "editor"), createGalleryItem);
router.put("/:id", protect, requireRole("super_admin", "editor"), updateGalleryItem);
router.delete("/:id", protect, requireRole("super_admin"), deleteGalleryItem);

// Photo upload
router.post(
  "/:id/image",
  protect,
  requireRole("super_admin", "editor"),
  uploadGallery.single("image"),
  uploadGalleryPhoto
);

export default router;
