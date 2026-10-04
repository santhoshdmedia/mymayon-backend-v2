import { Router } from "express";
import {
  listPackages,
  getPackage,
  createPackage,
  createPackagesBulk,
  seedPdfPackagesController,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import {
  uploadPackageImages,
  deletePackageImage,
  updatePackageImage,
} from "../controllers/uploadController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

const router = Router();

// Middleware: authenticate if Authorization header present; in dev mode allow without header
function authOrDev(req, res, next) {
  if (req.headers.authorization) {
    return protect(req, res, () => requireRole("super_admin", "editor")(req, res, next));
  }
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({ message: "Authorization required" });
  }
  next();
}

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", listPackages);
// Dedicated endpoint to seed or refresh all 38 district packages from the PDF guide
router.post("/seed-pdf", seedPdfPackagesController);
router.get("/:slug", getPackage);

// ── Package Creation & Management ─────────────────────────────────────────────
router.post("/bulk", authOrDev, createPackagesBulk);
router.post("/", authOrDev, createPackage);
router.put("/:id", protect, requireRole("super_admin", "editor"), updatePackage);
router.delete("/:id", protect, requireRole("super_admin"), deletePackage);

// ── Admin — Images ────────────────────────────────────────────────────────────
router.post(
  "/:id/images",
  protect,
  requireRole("super_admin", "editor"),
  upload.array("images", 5),
  uploadPackageImages
);
router.delete(
  "/:id/images/:imageId",
  protect,
  requireRole("super_admin", "editor"),
  deletePackageImage
);
router.patch(
  "/:id/images/:imageId",
  protect,
  requireRole("super_admin", "editor"),
  updatePackageImage
);

export default router;
