import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";

// Resolve .env from the project root regardless of where node is called from
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import connectDB from "./config/db.js";
import District from "./models/District.js";
import Package from "./models/Package.js";

// ─── Districts ────────────────────────────────────────────────────────────────
const districts = [
  // ── Northern ──
  {
    name: "Chennai", slug: "chennai", tamilName: "சென்னை",
    region: "Northern", presidingDeity: "Kapaleeshwarar (Shiva)",
    faithCategories: ["Hindu", "Christian"], circuits: [],
    templeCount: 42, idealSeason: "Nov–Feb",
    overview: "Chennai blends ancient Dravidian temples with colonial-era churches and a soaring lighthouse.",
    highlights: ["Kapaleeshwarar Temple", "San Thome Basilica", "Marina Beach", "Vivekananda House"],
    featured: true, isPublished: true,
  },
  {
    name: "Kanchipuram", slug: "kanchipuram", tamilName: "காஞ்சிபுரம்",
    region: "Northern", presidingDeity: "Ekambareswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Pancha Bhoota Sthalam"],
    templeCount: 108, idealSeason: "Oct–Mar",
    overview: "The city of a thousand temples, silk weaving and timeless Pallava architecture.",
    highlights: ["Ekambareswarar Temple", "Kailasanathar Temple", "Varadharaja Perumal Temple"],
    featured: true, isPublished: true,
  },
  {
    name: "Tiruvallur", slug: "tiruvallur", tamilName: "திருவள்ளூர்",
    region: "Northern", presidingDeity: "Veeraraghava Perumal",
    faithCategories: ["Hindu"], circuits: ["Divya Desam"],
    templeCount: 22, idealSeason: "Oct–Mar",
    overview: "Situated north of Chennai, Tiruvallur is known for its Divya Desam Vishnu temple.",
    highlights: ["Veeraraghava Perumal Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Vellore", slug: "vellore", tamilName: "வேலூர்",
    region: "Northern", presidingDeity: "Jalakandeswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 18, idealSeason: "Oct–Feb",
    overview: "Home to the Golden Temple of the BAPS Swaminarayan and the 16th-century Vellore Fort.",
    highlights: ["Vellore Fort Temple", "Golden Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Tiruvannamalai", slug: "tiruvannamalai", tamilName: "திருவண்ணாமலை",
    region: "Northern", presidingDeity: "Arunachaleswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Pancha Bhoota Sthalam"],
    templeCount: 64, idealSeason: "Nov–Feb",
    overview: "Home to Arunachala hill and the fire-element Pancha Bhoota Shiva temple.",
    highlights: ["Arunachaleswarar Temple", "Karthigai Deepam festival", "Ramana Ashram"],
    featured: true, isPublished: true,
  },
  {
    name: "Villupuram", slug: "villupuram", tamilName: "விழுப்புரம்",
    region: "Northern", presidingDeity: "Vedagiriswarar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 22, idealSeason: "Oct–Feb",
    overview: "Home to the Vedagiriswarar hill temple and the ancient Gingee fort complex.",
    highlights: ["Vedagiriswarar Temple", "Gingee Fort"],
    featured: false, isPublished: true,
  },
  {
    name: "Cuddalore", slug: "cuddalore", tamilName: "கடலூர்",
    region: "Northern", presidingDeity: "Thiyagarajar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 19, idealSeason: "Oct–Mar",
    overview: "Coastal district home to Pichavaram mangroves and ancient Chidambaram temple nearby.",
    highlights: ["Pichavaram Mangroves", "Silver Beach"],
    featured: false, isPublished: true,
  },
  {
    name: "Krishnagiri", slug: "krishnagiri", tamilName: "கிருஷ்ணகிரி",
    region: "Northern", presidingDeity: "Krishnagiri Murugan",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 9, idealSeason: "Oct–Feb",
    overview: "Mango-growing district bordering Karnataka, with rocky hills and ancient forts.",
    highlights: ["Krishnagiri Fort", "Rayakottai Fort"],
    featured: false, isPublished: true,
  },
  {
    name: "Dharmapuri", slug: "dharmapuri", tamilName: "தர்மபுரி",
    region: "Northern", presidingDeity: "Palamalai Amman",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 10, idealSeason: "Nov–Feb",
    overview: "Known for its mango orchards, waterfalls and ancient Amman shrines.",
    highlights: ["Hogenakkal Falls", "Palamalai Amman Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Tirupattur", slug: "tirupattur", tamilName: "திருப்பத்தூர்",
    region: "Northern", presidingDeity: "Vellalar Murugan",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 8, idealSeason: "Oct–Feb",
    overview: "A recently formed district with lush forests and Yelagiri Hills resort.",
    highlights: ["Yelagiri Hills", "Jalagamparai Waterfall"],
    featured: false, isPublished: true,
  },
  {
    name: "Ranipet", slug: "ranipet", tamilName: "ராணிப்பேட்டை",
    region: "Northern", presidingDeity: "Srinivasa Perumal",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 11, idealSeason: "Oct–Feb",
    overview: "Industrial district with deep leather-tanning heritage and ancient shrines.",
    highlights: ["Arcot Fort", "Walajah Mosque"],
    featured: false, isPublished: true,
  },
  {
    name: "Kallakurichi", slug: "kallakurichi", tamilName: "கள்ளக்குறிச்சி",
    region: "Northern", presidingDeity: "Kalasapakkam Murugan",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 7, idealSeason: "Oct–Feb",
    overview: "A new district with tribal hill communities and sugarcane fields.",
    highlights: ["Thenpennai Riverbank"],
    featured: false, isPublished: true,
  },

  // ── Western ──
  {
    name: "Coimbatore", slug: "coimbatore", tamilName: "கோயம்புத்தூர்",
    region: "Western", presidingDeity: "Mahalingam (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 28, idealSeason: "Oct–Feb",
    overview: "The Manchester of South India, with the foothills of the Nilgiris rising to its west.",
    highlights: ["Marudamalai Temple", "Perur Pateeshwarar Temple", "Adiyogi Shiva"],
    featured: true, isPublished: true,
  },
  {
    name: "The Nilgiris", slug: "nilgiris", tamilName: "நீலகிரி",
    region: "Western", presidingDeity: "Murugan (Ooty Temple)",
    faithCategories: ["Hindu", "Christian"], circuits: [],
    templeCount: 8, idealSeason: "Mar–May",
    overview: "Blue mountains, tea estates, shola forests and the famous Nilgiri Mountain Railway.",
    highlights: ["Ooty Botanical Gardens", "Doddabetta Peak", "Nilgiri Mountain Railway"],
    featured: true, isPublished: true,
  },
  {
    name: "Tiruppur", slug: "tiruppur", tamilName: "திருப்பூர்",
    region: "Western", presidingDeity: "Subramaniam (Murugan)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 11, idealSeason: "Oct–Mar",
    overview: "India's knitwear capital with a growing spiritual tourism focus.",
    highlights: ["Thirumuruganpoondi Murugan Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Erode", slug: "erode", tamilName: "ஈரோடு",
    region: "Western", presidingDeity: "Bhavani Sangameswarar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 15, idealSeason: "Oct–Mar",
    overview: "Situated on the banks of the Kaveri and Bhavani rivers, known for textiles and temples.",
    highlights: ["Bhavani Sangameswarar Temple"],
    featured: false, isPublished: true,
  },

  // ── Central ──
  {
    name: "Trichy", slug: "trichy", tamilName: "திருச்சிராப்பள்ளி",
    region: "Central", presidingDeity: "Ranganathaswamy (Vishnu)",
    faithCategories: ["Hindu"], circuits: ["Divya Desam"],
    templeCount: 53, idealSeason: "Oct–Feb",
    overview: "Srirangam Island houses the largest functioning temple complex in the world.",
    highlights: ["Srirangam Temple", "Rock Fort Temple", "Jambukeswarar Temple"],
    featured: true, isPublished: true,
  },
  {
    name: "Salem", slug: "salem", tamilName: "சேலம்",
    region: "Central", presidingDeity: "Sugavaneswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 19, idealSeason: "Oct–Feb",
    overview: "Steel city of Tamil Nadu, flanked by the Shevaroy Hills and Yercaud.",
    highlights: ["Kottai Mariamman Temple", "Yercaud"],
    featured: false, isPublished: true,
  },
  {
    name: "Namakkal", slug: "namakkal", tamilName: "நாமக்கல்",
    region: "Central", presidingDeity: "Narasimha (Vishnu)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 14, idealSeason: "Oct–Feb",
    overview: "Famous for the rock-cut Narasimha temple and the giant Hanuman statue.",
    highlights: ["Narasimhaswamy Temple", "Hanuman Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Karur", slug: "karur", tamilName: "கரூர்",
    region: "Central", presidingDeity: "Pasupatheswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 16, idealSeason: "Oct–Mar",
    overview: "Textile town at the confluence of the Amaravathi and Kaveri rivers.",
    highlights: ["Pasupatheswarar Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Perambalur", slug: "perambalur", tamilName: "பெரம்பலூர்",
    region: "Central", presidingDeity: "Sundareswarar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 8, idealSeason: "Oct–Mar",
    overview: "Small district with limestone quarries and ancient Chola-period temples.",
    highlights: ["Kunnam Murugan Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Pudukottai", slug: "pudukottai", tamilName: "புதுக்கோட்டை",
    region: "Central", presidingDeity: "Kokarneswarar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 24, idealSeason: "Oct–Feb",
    overview: "Rock-cut cave temples and the ancient Viralimalai Murugan shrine define this district.",
    highlights: ["Viralimalai Murugan Temple", "Sittanavasal Cave Murals"],
    featured: false, isPublished: true,
  },

  // ── Delta ──
  {
    name: "Thanjavur", slug: "thanjavur", tamilName: "தஞ்சாவூர்",
    region: "Delta", presidingDeity: "Brihadeeswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Saptha Vidanga Sthalams"],
    templeCount: 74, idealSeason: "Dec–Feb",
    overview: "UNESCO-listed Brihadeeswarar Temple anchors this Chola-era heritage district.",
    highlights: ["Brihadeeswarar Temple", "Saraswathi Mahal Library", "Schwartz Church"],
    featured: true, isPublished: true,
  },
  {
    name: "Kumbakonam", slug: "kumbakonam", tamilName: "கும்பகோணம்",
    region: "Delta", presidingDeity: "Kumbeswarar (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Navagraha Temples", "Saptha Vidanga Sthalams"],
    templeCount: 188, idealSeason: "Nov–Mar",
    overview: "Temple town of the Chola delta, heart of the Navagraha circuit.",
    highlights: ["Kumbeswarar Temple", "Mahamaham Tank", "Sarangapani Temple"],
    featured: true, isPublished: true,
  },
  {
    name: "Nagapattinam", slug: "nagapattinam", tamilName: "நாகப்பட்டினம்",
    region: "Delta", presidingDeity: "Kayarohaneswarar (Shiva)",
    faithCategories: ["Hindu", "Buddhist"], circuits: ["Navagraha Temples"],
    templeCount: 45, idealSeason: "Oct–Mar",
    overview: "Ancient port city with a rich Buddhist heritage and Chola temple traditions.",
    highlights: ["Kayarohaneswarar Temple", "Velankanni Church", "Nagore Dargah"],
    featured: false, isPublished: true,
  },
  {
    name: "Tiruvarur", slug: "tiruvarur", tamilName: "திருவாரூர்",
    region: "Delta", presidingDeity: "Thyagarajar (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Saptha Vidanga Sthalams"],
    templeCount: 96, idealSeason: "Nov–Mar",
    overview: "Birthplace of the music trinity, with the magnificent Thyagarajar temple complex.",
    highlights: ["Thyagarajar Temple", "Kamalalayam Tank"],
    featured: false, isPublished: true,
  },
  {
    name: "Ariyalur", slug: "ariyalur", tamilName: "அரியலூர்",
    region: "Delta", presidingDeity: "Karpaga Vinayagar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 11, idealSeason: "Oct–Mar",
    overview: "Known for cement industries and ancient temples in the Chola heartland.",
    highlights: ["Palam Koothan Vinayagar Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Chidambaram", slug: "chidambaram", tamilName: "சிதம்பரம்",
    region: "Delta", presidingDeity: "Nataraja (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Pancha Bhoota Sthalam"],
    templeCount: 31, idealSeason: "Oct–Mar",
    overview: "The akasha (sky) element Pancha Bhoota Sthalam, home of the cosmic dancer Nataraja.",
    highlights: ["Nataraja Temple", "Pichavaram Mangroves"],
    featured: true, isPublished: true,
  },
  {
    name: "Mayiladuthurai", slug: "mayiladuthurai", tamilName: "மயிலாடுதுறை",
    region: "Delta", presidingDeity: "Mayuranathaswamy (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Navagraha Temples"],
    templeCount: 52, idealSeason: "Nov–Mar",
    overview: "The peacock temple town at the heart of the Navagraha circuit.",
    highlights: ["Mayuranathaswamy Temple", "Sirkazhi Sattainathar Temple"],
    featured: false, isPublished: true,
  },

  // ── Southern ──
  {
    name: "Madurai", slug: "madurai", tamilName: "மதுரை",
    region: "Southern", presidingDeity: "Meenakshi Amman",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 58, idealSeason: "Oct–Mar",
    overview: "The eternal city of Tamil Nadu, anchored by the spectacular Meenakshi Amman Temple.",
    highlights: ["Meenakshi Amman Temple", "Thiruparankundram (Arupadai Veedu)", "Alagar Kovil"],
    featured: true, isPublished: true,
  },
  {
    name: "Kanyakumari", slug: "kanyakumari", tamilName: "கன்னியாகுமரி",
    region: "Southern", presidingDeity: "Bhagavathy Amman",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 21, idealSeason: "Oct–Mar",
    overview: "India's southernmost tip, where the Arabian Sea, Bay of Bengal and Indian Ocean meet.",
    highlights: ["Kumari Amman Temple", "Vivekananda Rock Memorial", "Thiruvalluvar Statue"],
    featured: true, isPublished: true,
  },
  {
    name: "Ramanathapuram", slug: "ramanathapuram", tamilName: "இராமநாதபுரம்",
    region: "Southern", presidingDeity: "Ramanathaswamy (Shiva)",
    faithCategories: ["Hindu"], circuits: ["Char Dham"],
    templeCount: 16, idealSeason: "Oct–Apr",
    overview: "One of India's Char Dham sites, famed for its grand corridor architecture.",
    highlights: ["Ramanathaswamy Temple", "Pamban Bridge", "Agni Theertham"],
    featured: true, isPublished: true,
  },
  {
    name: "Tirunelveli", slug: "tirunelveli", tamilName: "திருநெல்வேலி",
    region: "Southern", presidingDeity: "Nellaiappar (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 38, idealSeason: "Oct–Feb",
    overview: "City of temples and the famous Tirunelveli halwa, on the banks of the Tamirabarani.",
    highlights: ["Nellaiappar Temple", "Krishnapuram Palace", "Manimuthar Falls"],
    featured: false, isPublished: true,
  },
  {
    name: "Thoothukudi", slug: "thoothukudi", tamilName: "தூத்துக்குடி",
    region: "Southern", presidingDeity: "Subramanya (Murugan)",
    faithCategories: ["Hindu", "Christian"], circuits: ["Arupadai Veedu"],
    templeCount: 14, idealSeason: "Oct–Mar",
    overview: "Major port city on the Gulf of Mannar, with pearl fishing heritage.",
    highlights: ["Tiruchendur Murugan Temple", "Sancta Maria Church"],
    featured: false, isPublished: true,
  },
  {
    name: "Tenkasi", slug: "tenkasi", tamilName: "தென்காசி",
    region: "Southern", presidingDeity: "Kasi Viswanathar (Shiva)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 12, idealSeason: "Nov–Feb",
    overview: "The Southern Kasi, with waterfalls and the historic Courtallam spa falls.",
    highlights: ["Kasi Viswanathar Temple", "Courtallam Falls"],
    featured: false, isPublished: true,
  },
  {
    name: "Virudhunagar", slug: "virudhunagar", tamilName: "விருதுநகர்",
    region: "Southern", presidingDeity: "Shanmuganatha (Murugan)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 15, idealSeason: "Oct–Feb",
    overview: "Known for matchbox manufacturing and ancient Murugan temples.",
    highlights: ["Sivakasi Fireworks", "Arulmigu Shanmuganatha Temple"],
    featured: false, isPublished: true,
  },
  {
    name: "Sivaganga", slug: "sivaganga", tamilName: "சிவகங்கை",
    region: "Southern", presidingDeity: "Kalayar Kovil (Vishnu)",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 18, idealSeason: "Oct–Mar",
    overview: "District of the warrior queen Velu Nachiyar, with a beautiful Vishnu hill temple.",
    highlights: ["Kalayar Kovil", "Devakottai Mosque"],
    featured: false, isPublished: true,
  },
  {
    name: "Dindigul", slug: "dindigul", tamilName: "திண்டுக்கல்",
    region: "Southern", presidingDeity: "Athiayaman",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 13, idealSeason: "Oct–Mar",
    overview: "Famous for its 17th-century rock fort and Kodaikanal, the Princess of Hill Stations.",
    highlights: ["Dindigul Fort", "Kodaikanal Lake", "Kodaikanal Coaker's Walk"],
    featured: true, isPublished: true,
  },
  {
    name: "Theni", slug: "theni", tamilName: "தேனி",
    region: "Southern", presidingDeity: "Arulmigu Ayyanar",
    faithCategories: ["Hindu"], circuits: [],
    templeCount: 10, idealSeason: "Oct–Feb",
    overview: "Gateway to the High Range forests and the Periyar Tiger Reserve.",
    highlights: ["Megamalai Wildlife Sanctuary", "Vaigai Dam"],
    featured: false, isPublished: true,
  },
];

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

    // Build slug→ObjectId map for district references
    const districtMap = {};
    insertedDistricts.forEach((d) => { districtMap[d.slug] = d._id; });

    console.log("⏳ Clearing existing packages…");
    await Package.deleteMany({});

    const pkgsWithDistrict = packages.map((p) => {
      const slug = p.locationLabel.toLowerCase().trim().replace(/\s+/g, "-");
      const districtId = districtMap[slug] || null;
      if (!districtId) {
        console.warn(`⚠ No matching district found for package "${p.title}" (locationLabel: "${p.locationLabel}", slug tried: "${slug}")`);
      }
      return { ...p, district: districtId };
    });

    const insertedPackages = await Package.insertMany(pkgsWithDistrict);
    console.log(`✓ Seeded ${insertedPackages.length} packages`);

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