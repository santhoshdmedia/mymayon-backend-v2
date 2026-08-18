import { Router } from "express";
import { body } from "express-validator";
import { registerVendor, listVendors, updateVendorStatus } from "../controllers/vendorController.js";
import { validate, asyncHandler } from "../middleware/validate.js";

const router = Router();

router.post(
  "/",
  [
    body("businessName").notEmpty(),
    body("category").isIn(["Hotel", "Guide", "Transport", "Photographer", "Experience Provider"]),
    body("contactName").notEmpty(),
    body("phone").notEmpty(),
    body("email").isEmail(),
  ],
  validate,
  asyncHandler(registerVendor)
);

router.get("/", asyncHandler(listVendors));
router.patch("/:id/status", asyncHandler(updateVendorStatus));

export default router;
