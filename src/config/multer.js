import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// uploads/ lives at project root
const UPLOAD_DIR = path.join(__dirname, "../../uploads/packages");
const HERO_UPLOAD_DIR = path.join(__dirname, "../../uploads/hero");
const GALLERY_UPLOAD_DIR = path.join(__dirname, "../../uploads/gallery");

// Create folders if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(HERO_UPLOAD_DIR)) fs.mkdirSync(HERO_UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(GALLERY_UPLOAD_DIR)) fs.mkdirSync(GALLERY_UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function fileFilter(_req, file, cb) {
  ALLOWED_MIME.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPG, PNG and WebP images are allowed"));
}

// ── Package image uploads ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter,
});

export const UPLOAD_DIR_PATH = UPLOAD_DIR;

// ── Hero slider image uploads ───────────────────────────────────────────────
const heroStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, HERO_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

export const uploadHero = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter,
});

export const HERO_UPLOAD_DIR_PATH = HERO_UPLOAD_DIR;

// ── Gallery image uploads ───────────────────────────────────────────────────
const galleryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, GALLERY_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

export const uploadGallery = multer({
  storage: galleryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter,
});

export const GALLERY_UPLOAD_DIR_PATH = GALLERY_UPLOAD_DIR;