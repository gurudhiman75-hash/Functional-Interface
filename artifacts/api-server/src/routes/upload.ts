import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/auth";
import { storage } from "../lib/firebase-admin";
import { assertAdmin } from "./admin-data";

const router: IRouter = Router();

// Accept only image files, keep in memory (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const ALLOWED_FOLDERS = new Set(["question-images", "di-set-images"]);

/**
 * POST /upload
 * Admin-only. Accepts a multipart/form-data "file" field and an optional "folder" field.
 * Uploads to Firebase Storage and returns the public download URL.
 */
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    await assertAdmin(req.user!.id);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const folder = (req.body.folder as string) ?? "question-images";
    if (!ALLOWED_FOLDERS.has(folder)) {
      return res.status(400).json({ error: `Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(", ")}` });
    }

    if (!storage) {
      return res.status(503).json({ error: "Firebase Storage is not configured on this server" });
    }

    const bucketName = process.env.VITE_FIREBASE_STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      return res.status(503).json({ error: "VITE_FIREBASE_STORAGE_BUCKET env var is not set" });
    }

    const ext = path.extname(req.file.originalname) || `.${req.file.mimetype.split("/")[1] ?? "bin"}`;
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(filename);

    await fileRef.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    // Make file publicly readable
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    return res.json({ url: publicUrl });
  } catch (err: any) {
    if (err?.message === "forbidden") return res.status(403).json({ error: "Admin access required" });
    console.error("[upload] Error:", err);
    return res.status(500).json({ error: err?.message ?? "Upload failed" });
  }
});

export default router;
