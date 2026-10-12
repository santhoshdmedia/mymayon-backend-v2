import { Router } from "express";
import {
  listDistricts,
  getDistrict,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  uploadDistrictImage,
  deleteDistrictImage,
} from "../controllers/districtController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadDistrict } from "../config/multer.js";

const router = Router();
router.get("/",          listDistricts);
router.get("/:slug",     getDistrict);
router.post("/",         protect, requireRole("super_admin","editor"), createDistrict);
router.put("/:id",       protect, requireRole("super_admin","editor"), updateDistrict);
router.delete("/:id",    protect, requireRole("super_admin"), deleteDistrict);

// Cover image upload / delete
router.post(
  "/:id/image",
  protect,
  requireRole("super_admin", "editor"),
  uploadDistrict.single("image"),
  uploadDistrictImage
);
router.delete(
  "/:id/image",
  protect,
  requireRole("super_admin", "editor"),
  deleteDistrictImage
);

export default router;
