import { Router } from "express";
import {
  listPublicHeroSlides,
  listAllHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
  uploadHeroSlideImage,
  deleteHeroSlideImage,
} from "../controllers/heroSlideController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadHero } from "../config/multer.js";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", listPublicHeroSlides);

// ── Admin — management ───────────────────────────────────────────────────────
router.get("/all", protect, requireRole("super_admin", "editor"), listAllHeroSlides);
router.patch("/reorder", protect, requireRole("super_admin", "editor"), reorderHeroSlides);
router.get("/:id", protect, requireRole("super_admin", "editor"), getHeroSlide);

router.post("/", protect, requireRole("super_admin", "editor"), createHeroSlide);
router.put("/:id", protect, requireRole("super_admin", "editor"), updateHeroSlide);
router.delete("/:id", protect, requireRole("super_admin"), deleteHeroSlide);

// ── Admin — image ─────────────────────────────────────────────────────────────
router.post(
  "/:id/image",
  protect, requireRole("super_admin", "editor"),
  uploadHero.single("image"),
  uploadHeroSlideImage
);
router.delete(
  "/:id/image",
  protect, requireRole("super_admin", "editor"),
  deleteHeroSlideImage
);

export default router;
