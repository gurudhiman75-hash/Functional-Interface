import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exportCP001GoldenBatchJson } from "./question-studio-adapter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDir = join(__dirname, "review-batches");
mkdirSync(targetDir, { recursive: true });

const targetFile = join(targetDir, "pun-001-cp001-review-batch-v1.json");
const json = exportCP001GoldenBatchJson(60, 5000);
writeFileSync(targetFile, json, "utf-8");

console.log(`Exported 60-question golden review batch to: ${targetFile}`);
