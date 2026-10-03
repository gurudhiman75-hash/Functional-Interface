import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import multer from "multer";

import { storage } from "../lib/firebase-admin";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const ALLOWED_FOLDERS = new Set([
  "question-images",
  "di-set-images",
  "banners",
  "promotions",
  "exam-categories",
  "test-series",
  "notifications",
  "content",
]);

function safeExtension(file: Express.Multer.File): string {
  const mimeExtensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  return mimeExtensions[file.mimetype] ?? "img";
}

/**
 * POST /upload
 * Admin-only. Accepts multipart/form-data field "file" and optional "folder".
 * Stores the image in Firebase Storage under public/<folder>/ and returns a
 * stable Firebase download URL.
 */
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  try {
    await assertAdmin(req.user!.id);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const folder = String(req.body.folder ?? "question-images").trim();
    if (!ALLOWED_FOLDERS.has(folder)) {
      return res.status(400).json({
        error: `Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(", ")}`,
      });
    }

    if (!storage) {
      return res.status(503).json({
        error: "Firebase Storage is unavailable. Check Firebase Admin credentials and FIREBASE_STORAGE_BUCKET.",
      });
    }

    const bucket = storage.bucket();
    const id = randomUUID();
    const objectPath = `public/${folder}/${id}.${safeExtension(req.file)}`;
    const downloadToken = randomUUID();
    const file = bucket.file(objectPath);

    await file.save(req.file.buffer, {
      resumable: false,
      validation: "crc32c",
      contentType: req.file.mimetype,
      metadata: {
        cacheControl: "public,max-age=31536000,immutable",
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
          originalName: req.file.originalname.slice(0, 240),
          uploadedBy: req.user!.id,
        },
      },
    });

    const url =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket.name)}` +
      `/o/${encodeURIComponent(objectPath)}?alt=media&token=${downloadToken}`;

    return res.json({
      url,
      path: objectPath,
      bucket: bucket.name,
      contentType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err: any) {
    if (err?.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    console.error("[upload] Firebase Storage upload failed:", err);
    return res.status(500).json({ error: err?.message ?? "Upload failed" });
  }
});

export default router;
