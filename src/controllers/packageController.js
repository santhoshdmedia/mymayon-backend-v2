import Package from "../models/Package.js";
import District from "../models/District.js";
import { PDF_PACKAGES } from "../data/pdfPackagesData.js";

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const DISTRICT_ALIASES = {
  pudukkottai: "pudukottai",
  karaikudi: "sivaganga",
  tirupathur: "tirupattur",
  viluppuram: "villupuram",
  tiruchirappalli: "trichy",
};

function createDistrictMatcher(allDistricts) {
  return (val) => {
    if (!val) return null;
    let target = String(val).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (DISTRICT_ALIASES[target]) target = DISTRICT_ALIASES[target];
    const match = allDistricts.find(
      (d) =>
        d.slug.replace(/[^a-z0-9]/g, "") === target ||
        d.name.toLowerCase().replace(/[^a-z0-9]/g, "") === target ||
        d.name.toLowerCase().includes(target) ||
        target.includes(d.slug.replace(/[^a-z0-9]/g, ""))
    );
    return match ? match._id : null;
  };
}

async function resolveDistrictId(districtIdentifier) {
  if (!districtIdentifier) return null;
  let cleaned = String(districtIdentifier).toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  if (DISTRICT_ALIASES[cleaned]) cleaned = DISTRICT_ALIASES[cleaned];
  const district = await District.findOne({
    $or: [
      { slug: cleaned },
      { name: { $regex: new RegExp(`^${cleaned}$`, "i") } },
      { slug: { $regex: new RegExp(cleaned, "i") } },
    ],
  }).select("_id");
  return district ? district._id : null;
}

export async function listPackages(req, res) {
  try {
    const { category, featured, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { locationLabel: { $regex: search, $options: "i" } },
        { tagline: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Package.find(filter)
        .populate("district")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Package.countDocuments(filter),
    ]);
    res.json({ total, page: Number(page), data });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch packages", error: err.message });
  }
}

export async function getPackage(req, res) {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug })
      .populate("district")
      .lean();
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ data: pkg });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch package", error: err.message });
  }
}

export async function createPackage(req, res) {
  try {
    const payload = { ...req.body };

    if (!payload.title) {
      return res.status(400).json({ message: "Package title is required" });
    }

    if (!payload.slug) {
      payload.slug = generateSlug(payload.title);
    } else {
      payload.slug = generateSlug(payload.slug);
    }

    // Check if slug already exists
    const existing = await Package.findOne({ slug: payload.slug });
    if (existing) {
      return res.status(409).json({
        message: `A package with slug '${payload.slug}' already exists`,
        existingId: existing._id,
      });
    }

    // Auto-resolve district reference if not provided
    if (!payload.district && (payload.locationLabel || payload.districtQuery)) {
      payload.district = await resolveDistrictId(payload.districtQuery || payload.locationLabel);
    }

    const pkg = await Package.create(payload);
    res.status(201).json({
      message: "Package created successfully",
      data: pkg,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || "Failed to create package",
      errors: err.errors,
    });
  }
}

export async function createPackagesBulk(req, res) {
  try {
    const incoming = Array.isArray(req.body) ? req.body : req.body.packages;
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({ message: "An array of packages is required in body or 'packages' key" });
    }

    const results = [];
    const errors = [];

    // Pre-load all districts for fast matching
    const allDistricts = await District.find().select("_id name slug").lean();
    const districtLookup = createDistrictMatcher(allDistricts);

    for (const item of incoming) {
      try {
        const pkgData = { ...item };
        if (!pkgData.title) throw new Error("Package title is required");
        if (!pkgData.slug) pkgData.slug = generateSlug(pkgData.title);

        if (!pkgData.district) {
          pkgData.district = districtLookup(pkgData.districtQuery || pkgData.locationLabel);
        }

        const upserted = await Package.findOneAndUpdate(
          { slug: pkgData.slug },
          { $set: pkgData },
          { returnDocument: "after", upsert: true, runValidators: true }
        );
        results.push(upserted);
      } catch (itemErr) {
        errors.push({ item: item.title || item.slug || "Unknown", error: itemErr.message });
      }
    }

    res.status(200).json({
      message: `Processed ${incoming.length} packages: ${results.length} succeeded, ${errors.length} failed.`,
      succeededCount: results.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: "Bulk package creation failed", error: err.message });
  }
}

export async function seedPdfPackagesController(req, res) {
  try {
    const allDistricts = await District.find().select("_id name slug").lean();
    const districtLookup = createDistrictMatcher(allDistricts);

    const seeded = [];
    for (const pkg of PDF_PACKAGES) {
      const districtId = districtLookup(pkg.districtQuery || pkg.locationLabel);
      const pkgToSave = {
        ...pkg,
        district: districtId || undefined,
      };

      const doc = await Package.findOneAndUpdate(
        { slug: pkg.slug },
        { $set: pkgToSave },
        { returnDocument: "after", upsert: true, runValidators: true }
      );
      seeded.push(doc);
    }

    res.status(200).json({
      message: `Successfully seeded all ${seeded.length} district packages from PDF`,
      total: seeded.length,
      data: seeded,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to seed PDF packages",
      error: err.message,
    });
  }
}

export async function updatePackage(req, res) {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Package updated successfully", data: pkg });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deletePackage(req, res) {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
