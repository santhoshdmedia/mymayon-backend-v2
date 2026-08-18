import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import districtRoutes from "./src/routes/districts.js";
import packageRoutes  from "./src/routes/packages.js";
import enquiryRoutes  from "./src/routes/enquiries.js";
import authRoutes     from "./src/routes/auth.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",").map(o => o.trim());

app.use(helmet());
app.use(cors({ /* ...unchanged... */ }));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.get("/api/health", (_, res) => res.json({ status: "ok", ts: new Date() }));
app.use("/api/auth",       authRoutes);
app.use("/api/districts",  districtRoutes);
app.use("/api/packages",   packageRoutes);
app.use("/api/enquiries",  enquiryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

connectDB().then(() => app.listen(PORT, () => console.log(`✓ API running on http://localhost:${PORT}`)));
