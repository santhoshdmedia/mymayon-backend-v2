import Announcement from "../models/Announcement.js";
import GalleryItem from "../models/GalleryItem.js";

const DEFAULT_ANNOUNCEMENTS = [
  {
    text: "Special Arupadai Veedu 6 Abodes Murugan Temple Circuit — Booking Open",
    link: "/packages",
    badge: "Highlights",
    isActive: true,
    order: 0,
  },
  {
    text: "Discover all 38 Districts of Tamil Nadu with Curated Itineraries",
    link: "/destinations/district-explorer",
    badge: "38 Districts",
    isActive: true,
    order: 1,
  },
  {
    text: "24/7 Travel Desk & Darshan Support: +91 95971 00664",
    link: "/contact",
    badge: "Helpline",
    isActive: true,
    order: 2,
  },
  {
    text: "Navagraha 9 Temple Kaveri Delta 2-Day Package — Verified Stays & Guides",
    link: "/packages",
    badge: "Spiritual",
    isActive: true,
    order: 3,
  },
  {
    text: "Explore our Photo Gallery — Real Journeys & Sacred Moments",
    link: "/gallery",
    badge: "Gallery",
    isActive: true,
    order: 4,
  },
  {
    text: "Customized Family & Spiritual Tours — Itinerary in 24 Hours with 0 Advance",
    link: "/plan-my-trip",
    badge: "Offer",
    isActive: true,
    order: 5,
  },
];

const DEFAULT_GALLERY = [
  {
    title: "Brihadeeswara Temple at Twilight",
    category: "Spiritual & Temples",
    location: "Thanjavur",
    image: { url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80" },
    description: "1,000-year-old Chola architectural marvel carved purely out of granite.",
    tag: "UNESCO World Heritage",
    likes: 142,
    order: 0,
  },
  {
    title: "Meenakshi Amman Gopuram Towers",
    category: "Spiritual & Temples",
    location: "Madurai",
    image: { url: "https://images.unsplash.com/photo-1609766857329-873b88b08709?auto=format&fit=crop&w=1200&q=80" },
    description: "Vibrant sculpted towers depicting thousands of mythological figures.",
    tag: "Living Legend",
    likes: 198,
    order: 1,
  },
  {
    title: "Kanyakumari Triveni Sangam Sunrise",
    category: "Coastal & Beaches",
    location: "Kanyakumari",
    image: { url: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80" },
    description: "The sacred meeting point of the Arabian Sea, Indian Ocean, and Bay of Bengal.",
    tag: "Three Seas",
    likes: 165,
    order: 2,
  },
  {
    title: "Nilgiri Mountain Tea Gardens in Mist",
    category: "Nature & Hills",
    location: "Ooty / Nilgiris",
    image: { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80" },
    description: "Rolling emerald hills and historic heritage toy train routes in the Western Ghats.",
    tag: "Hill Retreat",
    likes: 210,
    order: 3,
  },
  {
    title: "Shore Temple by the Bay of Bengal",
    category: "Heritage & History",
    location: "Mahabalipuram",
    image: { url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80" },
    description: "8th-century Pallava structural temple overlooking the waves.",
    tag: "Pallava Heritage",
    likes: 177,
    order: 4,
  },
  {
    title: "Pichavaram Mangrove Forest Dawn Row",
    category: "Nature & Hills",
    location: "Chidambaram / Cuddalore",
    image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
    description: "The world's second-largest mangrove ecosystem navigated via wooden boats.",
    tag: "Eco Discovery",
    likes: 124,
    order: 5,
  },
  {
    title: "Chettinad Heritage Mansion Courtyard",
    category: "Heritage & History",
    location: "Karaikudi / Chettinad",
    image: { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80" },
    description: "Burmese teak pillars, Italian marble, and Athangudi handmade tiles.",
    tag: "Aristocratic Living",
    likes: 139,
    order: 6,
  },
  {
    title: "Rameshwaram Corridor of 1,200 Pillars",
    category: "Spiritual & Temples",
    location: "Rameswaram",
    image: { url: "https://images.unsplash.com/photo-1621682372775-533449e550ed?auto=format&fit=crop&w=1200&q=80" },
    description: "The world's longest temple corridor with intricately sculpted stone columns.",
    tag: "Char Dham",
    likes: 230,
    order: 7,
  },
  {
    title: "Traditional Bharatanatyam Temple Recital",
    category: "Culture & Festivals",
    location: "Thanjavur / Chennai",
    image: { url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80" },
    description: "Centuries-old classical dance form dedicated to divine storytelling and devotion.",
    tag: "Living Art",
    likes: 184,
    order: 8,
  },
  {
    title: "Authentic Chettinad Banana Leaf Feast",
    category: "Cuisine & Trails",
    location: "Karaikudi",
    image: { url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80" },
    description: "Slow-roasted stone-ground spices, kuzhambu, and traditional hospitality.",
    tag: "Culinary Icon",
    likes: 156,
    order: 9,
  },
  {
    title: "Kodaikanal Lake in Evening Fog",
    category: "Nature & Hills",
    location: "Kodaikanal",
    image: { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" },
    description: "Star-shaped lake surrounded by misty pine forests and shola valleys.",
    tag: "Princess of Hills",
    likes: 147,
    order: 10,
  },
  {
    title: "Dhanushkodi Land’s End Ghost Town",
    category: "Coastal & Beaches",
    location: "Rameswaram Island",
    image: { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" },
    description: "Where the oceans merge at the ruins of India’s most mythical shoreline.",
    tag: "Mystic Coast",
    likes: 215,
    order: 11,
  },
];

export async function autoSeed() {
  try {
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.insertMany(DEFAULT_ANNOUNCEMENTS);
      console.log(`✓ Auto-seeded ${DEFAULT_ANNOUNCEMENTS.length} announcements for secondary navbar ticker`);
    }

    const galCount = await GalleryItem.countDocuments();
    if (galCount === 0) {
      await GalleryItem.insertMany(DEFAULT_GALLERY);
      console.log(`✓ Auto-seeded ${DEFAULT_GALLERY.length} photo items for gallery`);
    }
  } catch (err) {
    console.warn("⚠ Auto-seed note:", err.message);
  }
}
