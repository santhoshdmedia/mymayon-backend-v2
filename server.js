import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { autoSeed } from "./src/config/autoSeed.js";
import districtRoutes from "./src/routes/districts.js";
import packageRoutes  from "./src/routes/packages.js";
import enquiryRoutes  from "./src/routes/enquiries.js";
import authRoutes     from "./src/routes/auth.js";
import heroSlideRoutes from "./src/routes/heroSlides.js";
import announcementRoutes from "./src/routes/announcements.js";
import galleryRoutes from "./src/routes/gallery.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app  = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",").map(o => o.trim());

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost") || origin.includes("mymayon.com") || origin.includes("vercel.app")) {
      return callback(null, true);
    }
    return callback(null, true); // Allow during dev
  },
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.get("/api/health", (_, res) => res.json({ status: "ok", ts: new Date() }));
app.use("/api/auth",          authRoutes);
app.use("/api/districts",     districtRoutes);
app.use("/api/packages",      packageRoutes);
app.use("/api/enquiries",     enquiryRoutes);
app.use("/api/hero-slides",    heroSlideRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/gallery",       galleryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

connectDB().then(async () => {
  await autoSeed();
  app.listen(PORT, () => console.log(`✓ API running on http://localhost:${PORT}`));
});
