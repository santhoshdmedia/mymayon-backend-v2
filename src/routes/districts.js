import { Router } from "express";
import { listDistricts, getDistrict, createDistrict, updateDistrict, deleteDistrict } from "../controllers/districtController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.get("/",          listDistricts);
router.get("/:slug",     getDistrict);
router.post("/",         protect, requireRole("super_admin","editor"), createDistrict);
router.put("/:id",       protect, requireRole("super_admin","editor"), updateDistrict);
router.delete("/:id",    protect, requireRole("super_admin"), deleteDistrict);
export default router;
