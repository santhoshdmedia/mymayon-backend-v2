/**
 * Creates the default super admin account.
 * Run once: node src/seedAdmin.js
 */
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

async function seedAdmin() {
  await connectDB();
  const existing = await Admin.findOne({ email: "admin@mymayon.com" });
  if (existing) {
    console.log("✓ Admin already exists — email: admin@mymayon.com");
    process.exit(0);
  }
  await Admin.create({
    name:     "My Mayon Admin",
    email:    "admin@mymayon.com",
    password: "admin123",
    role:     "super_admin",
    isActive: true,
  });
  console.log("✅ Admin created!");
  console.log("   Email:    admin@mymayon.com");
  console.log("   Password: admin123");
  console.log("   ⚠  Change this password after first login.");
  process.exit(0);
}
seedAdmin().catch(e => { console.error(e.message); process.exit(1); });
