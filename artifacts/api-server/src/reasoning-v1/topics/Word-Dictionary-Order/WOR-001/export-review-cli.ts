import { fileURLToPath } from "node:url";
import path from "node:path";
import { exportWorReviewPacks } from "./review-pack";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = process.env.WOR_REVIEW_OUTPUT
  ? path.resolve(process.env.WOR_REVIEW_OUTPUT)
  : path.join(moduleDirectory, "review");

await exportWorReviewPacks(outputDirectory);
console.log(`WOR-001 review packs exported to ${outputDirectory}`);
