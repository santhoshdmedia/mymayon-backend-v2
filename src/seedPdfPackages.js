import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import connectDB from "./config/db.js";
import District from "./models/District.js";
import Package from "./models/Package.js";
import { PDF_PACKAGES } from "./data/pdfPackagesData.js";

async function seedPdfPackages() {
  console.log("=================================================");
  console.log("🗺️  SEEDING 38-DISTRICT TOUR PACKAGES FROM PDF");
  console.log("    Started at:", new Date().toISOString());
  console.log("=================================================");

  try {
    await connectDB();
    console.log("✓ Connected to MongoDB");

    const allDistricts = await District.find().select("_id name slug").lean();
    console.log(`ℹ Found ${allDistricts.length} districts in database`);

    const aliases = {
      pudukkottai: "pudukottai",
      karaikudi: "sivaganga",
      tirupathur: "tirupattur",
      viluppuram: "villupuram",
      tiruchirappalli: "trichy",
    };

    const districtLookup = (val) => {
      if (!val) return null;
      let target = String(val).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
      if (aliases[target]) target = aliases[target];
      const match = allDistricts.find(
        (d) =>
          d.slug.replace(/[^a-z0-9]/g, "") === target ||
          d.name.toLowerCase().replace(/[^a-z0-9]/g, "") === target ||
          d.name.toLowerCase().includes(target) ||
          target.includes(d.slug.replace(/[^a-z0-9]/g, ""))
      );
      return match ? match._id : null;
    };

    let seededCount = 0;
    for (const pkg of PDF_PACKAGES) {
      const districtId = districtLookup(pkg.districtQuery || pkg.locationLabel);
      const doc = {
        ...pkg,
        district: districtId || undefined,
      };

      await Package.findOneAndUpdate(
        { slug: pkg.slug },
        { $set: doc },
        { returnDocument: "after", upsert: true, runValidators: true }
      );
      seededCount++;
      const distInfo = districtId ? "✓ District linked" : "⚠ No district match";
      console.log(`[${seededCount}/${PDF_PACKAGES.length}] Seeded: ${pkg.locationLabel.padEnd(16)} | ₹${String(pkg.priceFrom).padStart(6)} | ${distInfo}`);
    }

    console.log("=================================================");
    console.log(`🎉 SUCCESS: Seeded/Updated all ${seededCount} district packages!`);
    console.log("=================================================");
    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding failed with error:", err);
    process.exit(1);
  }
}

seedPdfPackages();
