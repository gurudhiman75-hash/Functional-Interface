import { Router, type IRouter } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";
import { v2 as cloudinary } from "cloudinary";

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
 * Uploads to Cloudinary and returns the public download URL.
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

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(503).json({ error: "Cloudinary env vars not set (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)" });
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    // Upload buffer to Cloudinary via stream
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
          resolve(result as { secure_url: string });
        },
      );
      stream.end(req.file!.buffer);
    });

    return res.json({ url: result.secure_url });
  } catch (err: any) {
    if (err?.message === "forbidden") return res.status(403).json({ error: "Admin access required" });
    console.error("[upload] Error:", err);
    return res.status(500).json({ error: err?.message ?? "Upload failed" });
  }
});

export default router;
