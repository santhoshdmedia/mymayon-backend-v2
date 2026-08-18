import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// uploads/ lives at project root
const UPLOAD_DIR = path.join(__dirname, "../../uploads/packages");

// Create folder if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

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
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG and WebP images are allowed"));
  },
});

export const UPLOAD_DIR_PATH = UPLOAD_DIR;
