import { Router } from "express";
import { createEnquiry, listEnquiries, updateEnquiryStatus, deleteEnquiry, getStats } from "../controllers/enquiryController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = Router();
router.post("/",              createEnquiry);
router.get("/",      protect, listEnquiries);
router.get("/stats", protect, getStats);
router.put("/:id",   protect, requireRole("super_admin","editor"), updateEnquiryStatus);
router.delete("/:id",protect, requireRole("super_admin"), deleteEnquiry);
export default router;
