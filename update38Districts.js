import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, ".env") });

import District from "./src/models/District.js";
import Package from "./src/models/Package.js";
import { DISTRICT_CHAPTERS } from "./src/data/districtChaptersData.js";

async function runUpdate() {
  console.log("==========================================================");
  console.log("🌟 UPDATING 38 DISTRICT DESCRIPTIONS IN MONGODB DATABASE");
  console.log("   My Mayon — Memorable Journeys, Curated Memories");
  console.log("==========================================================");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB:", mongoose.connection.name);

    let districtsUpdated = 0;
    let districtsCreated = 0;
    let packagesUpdated = 0;

    for (let i = 0; i < DISTRICT_CHAPTERS.length; i++) {
      const ch = DISTRICT_CHAPTERS[i];
      const num = i + 1;

      // Find district by slug, name or common alias
      const searchRegex = new RegExp(`^${ch.name}$`, "i");
      let dist = await District.findOne({
        $or: [
          { slug: ch.slug },
          { name: searchRegex },
          ...(ch.slug === "nilgiris" ? [{ slug: "the-nilgiris" }, { name: "The Nilgiris" }, { name: "Nilgiris" }] : []),
          ...(ch.slug === "trichy" ? [{ slug: "tiruchirappalli" }, { name: "Tiruchirappalli" }, { name: "Trichy" }] : []),
          ...(ch.slug === "pudukottai" ? [{ slug: "pudukkottai" }, { name: "Pudukkottai" }, { name: "Pudukottai" }] : []),
          ...(ch.slug === "tirupattur" ? [{ slug: "tirupathur" }, { name: "Tirupathur" }, { name: "Tirupattur" }] : []),
          ...(ch.slug === "villupuram" ? [{ slug: "viluppuram" }, { name: "Viluppuram" }, { name: "Villupuram" }] : []),
          ...(ch.slug === "kanchipuram" ? [{ slug: "kancheepuram" }, { name: "Kancheepuram" }, { name: "Kanchipuram" }] : []),
        ],
      });

      if (!dist) {
        // Create district if it doesn't exist
        dist = new District({
          name: ch.name,
          slug: ch.slug,
          tamilName: ch.tamilName,
          region: ch.region,
          presidingDeity: ch.presidingDeity,
          faithCategories: ["Hindu"],
          circuits: [],
          templeCount: 15,
          idealSeason: "Oct–Mar",
          tagline: ch.tagline,
          overview: ch.overview,
          experience: ch.experience,
          highlights: ch.highlights,
          inclusions: ch.inclusions,
          whoIsThisFor: ch.whoIsThisFor,
          featured: i < 8,
          isPublished: true,
        });
        await dist.save();
        districtsCreated++;
        console.log(`[${String(num).padStart(2, "0")}/38] ✦ Created District: ${ch.name} (slug: ${dist.slug})`);
      } else {
        // Update existing district
        dist.name = ch.name;
        dist.tamilName = ch.tamilName;
        dist.region = ch.region;
        dist.presidingDeity = ch.presidingDeity;
        dist.tagline = ch.tagline;
        dist.overview = ch.overview;
        dist.experience = ch.experience;
        dist.highlights = ch.highlights;
        dist.inclusions = ch.inclusions;
        dist.whoIsThisFor = ch.whoIsThisFor;
        await dist.save();
        districtsUpdated++;
        console.log(`[${String(num).padStart(2, "0")}/38] ✓ Updated District: ${ch.name} (slug: ${dist.slug})`);
      }

      // Also update linked Packages in Package collection for this district
      const pkgs = await Package.find({
        $or: [
          { slug: `${ch.slug}-one-day-tour` },
          { locationLabel: searchRegex },
          { locationLabel: new RegExp(`^${dist.name}$`, "i") },
          { district: dist._id },
        ],
      });

      for (const p of pkgs) {
        p.tagline = ch.tagline;
        p.description = ch.overview;
        p.highlights = ch.highlights;
        p.inclusions = ch.inclusions;
        p.whoIsThisFor = ch.whoIsThisFor;
        p.experience = ch.experience;
        p.district = dist._id;
        await p.save();
        packagesUpdated++;
      }
    }

    console.log("==========================================================");
    console.log(`🎉 COMPLETED SUCCESSFULLY:`);
    console.log(`   Districts Updated: ${districtsUpdated}`);
    console.log(`   Districts Created: ${districtsCreated}`);
    console.log(`   Total Districts Active: ${districtsUpdated + districtsCreated}`);
    console.log(`   Packages Synchronized: ${packagesUpdated}`);
    console.log("==========================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("✗ Error updating districts:", err);
    process.exit(1);
  }
}

runUpdate();
