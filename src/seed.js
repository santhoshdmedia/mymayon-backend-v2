import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

// Resolve .env from the project root regardless of where node is called from
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import connectDB from "./config/db.js";
import District from "./models/District.js";
import Package from "./models/Package.js";
import { PDF_PACKAGES } from "./data/pdfPackagesData.js";

import { DISTRICT_CHAPTERS } from "./data/districtChaptersData.js";

// ─── 38 Districts (Chapters) ──────────────────────────────────────────────────
const districts = DISTRICT_CHAPTERS.map((ch, idx) => ({
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
  featured: idx < 10,
  isPublished: true,
}));

// ─── Packages ─────────────────────────────────────────────────────────────────
const packages = [
  {
    title: "Chennai in a Day — Heritage & Coastal",
    slug: "chennai-heritage-coastal",
    category: "Spiritual",
    locationLabel: "Chennai",
    durationDays: 1,
    priceFrom: 2499,
    rating: 4.8,
    tagline: "One curated day through Chennai's most iconic spiritual and cultural landmarks.",
    description: "Discover Chennai through its ancient temples, colonial heritage and golden coastline in one perfectly paced day with a local guide.",
    stops: [
      { time: "7:00–9:30 AM",      label: "Morning",      title: "Kapaleeshwarar Temple",            description: "Begin at one of Chennai's most revered shrines, dedicated to Lord Shiva." },
      { time: "10:00 AM–12:30 PM", label: "Mid-Morning",  title: "San Thome Cathedral & Lighthouse", description: "Explore the Basilica, then ascend the Chennai Lighthouse for panoramic views." },
      { time: "1:00–3:30 PM",      label: "Afternoon",    title: "Marina Beach & Street Food",       description: "Stroll India's longest urban beach and sample sundal, bajjis and nongu." },
      { time: "6:30–8:30 PM",      label: "Evening",      title: "Besant Nagar Beach Sunset",        description: "Close the day with a sunset over the Bay of Bengal." },
    ],
    inclusions: ["Private AC vehicle all day", "English/Tamil local guide", "Temple darshan assistance", "Bottled water"],
    exclusions: ["Meals", "Entry tickets", "Personal expenses"],
    featured: true, isPublished: true,
  },
  {
    title: "Madurai Meenakshi Darshan",
    slug: "madurai-meenakshi-darshan",
    category: "Spiritual",
    locationLabel: "Madurai",
    durationDays: 2,
    priceFrom: 5999,
    rating: 4.9,
    tagline: "Two days in the eternal city — from the towers of Meenakshi to Thiruparankundram.",
    description: "Over two days, experience the grandeur of Meenakshi Amman, the cave temple at Thiruparankundram and the serene Alagar Kovil in the hills.",
    stops: [
      { time: "Day 1 AM", label: "Day 1", title: "Meenakshi Amman Temple",          description: "Arrive early for morning rituals and explore all four gopurams." },
      { time: "Day 1 PM", label: "Day 1", title: "Thirumalai Nayakkar Palace",       description: "Spectacular Indo-Saracenic architecture from the 17th century." },
      { time: "Day 2 AM", label: "Day 2", title: "Thiruparankundram (Arupadai Veedu)", description: "One of the six Murugan abodes, carved into a rocky hill 8 km from Madurai." },
      { time: "Day 2 PM", label: "Day 2", title: "Alagar Kovil",                    description: "Vishnu temple in the Azhagar hills — serene and crowd-free." },
    ],
    inclusions: ["1 night hotel (AC, breakfast)", "AC vehicle & driver", "Local expert guide", "Temple prasadam arrangements"],
    exclusions: ["Flights/train to Madurai", "Lunch & dinner", "Personal expenses"],
    featured: true, isPublished: true,
  },
  {
    title: "Thanjavur Big Temple Trail",
    slug: "thanjavur-big-temple-trail",
    category: "Heritage",
    locationLabel: "Thanjavur",
    durationDays: 2,
    priceFrom: 6499,
    rating: 4.7,
    tagline: "Step inside 1,000 years of Chola genius — temples, art and bronze masterpieces.",
    description: "The Brihadeeswarar Temple is one of the world's greatest architectural achievements. Explore it alongside Gangaikonda Cholapuram and the Thanjavur Art Gallery.",
    stops: [
      { time: "Day 1 AM", label: "Day 1", title: "Brihadeeswarar Temple",    description: "UNESCO World Heritage site — crown jewel of Chola architecture." },
      { time: "Day 1 PM", label: "Day 1", title: "Saraswathi Mahal Library", description: "One of Asia's oldest libraries with rare manuscripts and maps." },
      { time: "Day 2 AM", label: "Day 2", title: "Gangaikonda Cholapuram",   description: "The city of him who captured the Ganges — quieter but equally majestic." },
      { time: "Day 2 PM", label: "Day 2", title: "Darasuram Airavatesvara",  description: "Third of the great Chola temples — intricate carvings and musical steps." },
    ],
    inclusions: ["1 night hotel", "AC vehicle", "Certified heritage guide", "Water & snacks"],
    exclusions: ["Flights/train", "Meals unless specified", "Camera fees inside temples"],
    featured: true, isPublished: true,
  },
  {
    title: "Kanyakumari Sunrise Circuit",
    slug: "kanyakumari-sunrise-circuit",
    category: "Spiritual",
    locationLabel: "Kanyakumari",
    durationDays: 1,
    priceFrom: 2999,
    rating: 4.8,
    tagline: "Where three seas meet — a sunrise over the southernmost tip of India.",
    description: "Experience one of India's most breathtaking sunrises where the Arabian Sea, Bay of Bengal and Indian Ocean converge.",
    stops: [
      { time: "5:00 AM",  label: "Dawn",       title: "Sunrise Point",               description: "Witness the sunrise over the confluence of three seas." },
      { time: "7:00 AM",  label: "Morning",    title: "Kumari Amman Temple",          description: "Morning darshan at the ancient goddess temple overlooking the sea." },
      { time: "9:00 AM",  label: "Mid-Morning",title: "Vivekananda Rock Memorial",    description: "Ferry to the iconic rock where Swami Vivekananda meditated in 1892." },
      { time: "11:00 AM", label: "Late Morning",title: "Thiruvalluvar Statue",        description: "The 133-foot statue of the poet-philosopher, rising from the sea." },
    ],
    inclusions: ["Private AC vehicle", "Local guide", "Ferry tickets", "Bottled water"],
    exclusions: ["Meals", "Personal expenses"],
    featured: true, isPublished: true,
  },
  {
    title: "Rameswaram Pilgrimage",
    slug: "rameswaram-pilgrimage",
    category: "Spiritual",
    locationLabel: "Ramanathapuram",
    durationDays: 2,
    priceFrom: 7499,
    rating: 4.9,
    tagline: "One of India's four sacred Char Dham sites — complete the holy circuit.",
    description: "Rameswaram's Ramanathaswamy Temple has the longest temple corridor in India. Perform the 22 holy wells ritual and visit Dhanushkodi.",
    stops: [
      { time: "Day 1 AM", label: "Day 1", title: "Ramanathaswamy Temple", description: "The magnificent corridor temple — 22 theerthams (sacred wells) ritual bath." },
      { time: "Day 1 PM", label: "Day 1", title: "Agni Theertham",        description: "Sacred sea bathing point on the eastern shore." },
      { time: "Day 2 AM", label: "Day 2", title: "Dhanushkodi",           description: "The ghost town at the island's tip — eerie, beautiful, unforgettable." },
      { time: "Day 2 PM", label: "Day 2", title: "Gandhamadhana Parvatham", description: "Hillock with Lord Rama's footprint — panoramic views of the island." },
    ],
    inclusions: ["1 night stay", "AC vehicle & 4WD for Dhanushkodi", "Pilgrimage guide", "Water"],
    exclusions: ["Train/flight to Rameswaram", "Meals", "Dhoti/saree rental for temple"],
    featured: false, isPublished: true,
  },
  {
    title: "Navagraha Temple Circuit",
    slug: "navagraha-temples-circuit",
    category: "Spiritual",
    locationLabel: "Kumbakonam",
    durationDays: 2,
    priceFrom: 5499,
    rating: 4.8,
    tagline: "Nine planet temples in two days — astrology, architecture and pure devotion.",
    description: "The Navagraha circuit near Kumbakonam is one of Tamil Nadu's most unique pilgrimage trails — nine Shiva temples each presided by a celestial planet.",
    stops: [
      { time: "Day 1", label: "Day 1", title: "Suryanar Kovil & Chandran Kovil",               description: "Sun and Moon temples — the brightest and the serene." },
      { time: "Day 1", label: "Day 1", title: "Vaitheeswaran Kovil (Mars)",                    description: "Also a famous healing temple where thousands seek cure." },
      { time: "Day 2", label: "Day 2", title: "Swetaranyeswarar (Mercury) & Alangudi (Jupiter)",description: "Mercury and Jupiter temples in lush delta villages." },
      { time: "Day 2", label: "Day 2", title: "Remaining five planet temples",                 description: "Venus, Saturn, Rahu and Ketu temples to complete the sacred nine." },
    ],
    inclusions: ["1 night stay in Kumbakonam", "AC vehicle & driver", "Temple pooja guide", "Breakfast day 2"],
    exclusions: ["Flights/train", "Lunch & dinner", "Pooja materials"],
    featured: true, isPublished: true,
  },
  {
    title: "Nilgiri Blue Mountain Escape",
    slug: "nilgiri-blue-mountain-escape",
    category: "Nature",
    locationLabel: "Nilgiris",
    durationDays: 3,
    priceFrom: 10999,
    rating: 4.7,
    tagline: "Tea estates, misty peaks and the toy train UNESCO listed.",
    description: "Three days in the Nilgiris — ride the UNESCO Nilgiri Mountain Railway, walk through tea estates, trek to Doddabetta peak.",
    stops: [
      { time: "Day 1", label: "Day 1", title: "Nilgiri Mountain Railway (Mettupalayam→Ooty)", description: "The UNESCO-listed toy train through 16 tunnels and 208 curves." },
      { time: "Day 2", label: "Day 2", title: "Doddabetta Peak & Tea Factory",               description: "Highest point in the Nilgiris and a working tea factory tour." },
      { time: "Day 3", label: "Day 3", title: "Pykara Falls & Mudumalai",                    description: "Waterfall hike and optional wildlife safari." },
    ],
    inclusions: ["2 nights hotel (Ooty)", "Mountain railway tickets", "AC vehicle", "Breakfast daily"],
    exclusions: ["Dinner", "Personal expenses", "Safari fees"],
    featured: false, isPublished: true,
  },
  {
    title: "Chettinad Heritage & Food Trail",
    slug: "chettinad-heritage-food",
    category: "Heritage",
    locationLabel: "Karaikudi",
    durationDays: 2,
    priceFrom: 7999,
    rating: 4.8,
    tagline: "Grand mansions, antique bazaars and the most complex cuisine in Tamil Nadu.",
    description: "Chettinad is unlike anywhere else in India — palatial mansions built with Burmese teak and Italian tiles, and a cuisine that takes days to prepare.",
    stops: [
      { time: "Day 1 AM", label: "Day 1", title: "Athangudi Palace & Tilework",  description: "Explore the iconic handmade Athangudi tile floors — a living craft." },
      { time: "Day 1 PM", label: "Day 1", title: "Chettinad Cooking Class",       description: "Learn to prepare kuzhambu and kavuni arisi with a host family." },
      { time: "Day 2 AM", label: "Day 2", title: "Kanadukathan & Raja's Palace",  description: "Walk the village with crumbling mansions and antique shops." },
      { time: "Day 2 PM", label: "Day 2", title: "Pillayarpatti Rock-Cut Ganesh", description: "A unique cave temple with a 1,500-year-old Ganesh carved from rock." },
    ],
    inclusions: ["1 night stay (heritage property)", "AC vehicle", "Local food guide", "Cooking class fee"],
    exclusions: ["Train to Karaikudi", "Dinner on Day 1"],
    featured: false, isPublished: true,
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log("========================================");
  console.log("🌱 SEEDING STARTED:", new Date().toISOString());
  console.log("========================================");

  try {
    console.log("⏳ Connecting to database…");
    await connectDB();
    console.log("✓ Database connected");

    console.log("⏳ Clearing existing districts…");
    await District.deleteMany({});
    const insertedDistricts = await District.insertMany(districts);
    console.log(`✓ Seeded ${insertedDistricts.length} districts`);

    // Build district lookup helper for slug and name matching
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
      const match = insertedDistricts.find(
        (d) =>
          d.slug.replace(/[^a-z0-9]/g, "") === target ||
          d.name.toLowerCase().replace(/[^a-z0-9]/g, "") === target ||
          d.name.toLowerCase().includes(target) ||
          target.includes(d.slug.replace(/[^a-z0-9]/g, ""))
      );
      return match ? match._id : null;
    };

    console.log("⏳ Clearing existing packages…");
    await Package.deleteMany({});

    const allCombined = [...packages, ...PDF_PACKAGES];
    const pkgsWithDistrict = allCombined.map((p) => {
      const districtId = districtLookup(p.districtQuery || p.locationLabel);
      if (!districtId) {
        console.warn(`⚠ No matching district found for package "${p.title}" (locationLabel: "${p.locationLabel}")`);
      }
      return { ...p, district: districtId || undefined };
    });

    const insertedPackages = await Package.insertMany(pkgsWithDistrict);
    console.log(`✓ Seeded ${insertedPackages.length} packages (${packages.length} curated + ${PDF_PACKAGES.length} district packages from PDF)`);

    console.log("========================================");
    console.log("✅ SEEDING FINISHED SUCCESSFULLY:", new Date().toISOString());
    console.log("========================================");
    process.exit(0);
  } catch (err) {
    console.log("========================================");
    console.error("✗ SEEDING FAILED:", new Date().toISOString());
    console.error(err);
    console.log("========================================");
    process.exit(1);
  }
}

seed();