/**
 * Run this once to apply CORS to Firebase Storage bucket.
 * Requires: FIREBASE_SERVICE_ACCOUNT_KEY in env or --key-file flag.
 *
 * Usage:
 *   cd artifacts/api-server
 *   node --env-file=.env ../scripts/apply-storage-cors.mjs
 */

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// @google-cloud/storage is installed as devDependency in the scripts workspace
const { Storage } = await import("@google-cloud/storage");

const corsConfig = [
  {
    origin: [
      "https://sarbedutech.web.app",
      "https://sarbedutech.firebaseapp.com",
      "https://examtree-new.onrender.com",
      "http://localhost:5173",
      "http://localhost:4173",
    ],
    method: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    responseHeader: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With",
      "x-goog-resumable",
    ],
    maxAgeSeconds: 3600,
  },
];

// Resolve credentials
let credentials;
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log(`Using FIREBASE_SERVICE_ACCOUNT_KEY for project: ${credentials.project_id}`);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON");
  }
} else {
  throw new Error(
    "Set FIREBASE_SERVICE_ACCOUNT_KEY (the full service account JSON) in your .env file, then re-run."
  );
}

const bucketName = credentials.project_id + ".firebasestorage.app";
console.log(`Applying CORS to bucket: ${bucketName}`);

const storage = new Storage({ credentials, projectId: credentials.project_id });
const bucket = storage.bucket(bucketName);

await bucket.setCorsConfiguration(corsConfig);
const [meta] = await bucket.getMetadata();
console.log("✓ CORS applied. Current CORS config:", JSON.stringify(meta.cors, null, 2));
