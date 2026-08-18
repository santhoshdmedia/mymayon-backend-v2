import { Router } from "express";
import {
  listPackages, getPackage, createPackage, updatePackage, deletePackage,
} from "../controllers/packageController.js";
import {
  uploadPackageImages, deletePackageImage, updatePackageImage,
} from "../controllers/uploadController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",       listPackages);
router.get("/:slug",  getPackage);

// ── Admin — CRUD ──────────────────────────────────────────────────────────────
router.post(   "/",    protect, requireRole("super_admin","editor"), createPackage);
router.put(    "/:id", protect, requireRole("super_admin","editor"), updatePackage);
router.delete( "/:id", protect, requireRole("super_admin"),          deletePackage);

// ── Admin — Images ────────────────────────────────────────────────────────────
// Upload up to 5 files at once; form field name must be "images"
router.post(
  "/:id/images",
  protect, requireRole("super_admin","editor"),
  upload.array("images", 5),
  uploadPackageImages
);
router.delete(
  "/:id/images/:imageId",
  protect, requireRole("super_admin","editor"),
  deletePackageImage
);
router.patch(
  "/:id/images/:imageId",
  protect, requireRole("super_admin","editor"),
  updatePackageImage
);

export default router;
