import { fileURLToPath } from "node:url";
import path from "node:path";
import { exportWorBankingReviewPacks } from "./banking-review-pack";
import { exportWorReviewPacks } from "./review-pack";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = process.env.WOR_REVIEW_OUTPUT
  ? path.resolve(process.env.WOR_REVIEW_OUTPUT)
  : path.join(moduleDirectory, "review");

await exportWorReviewPacks(outputDirectory);
await exportWorBankingReviewPacks(outputDirectory);
console.log(`WOR-001 classic and Banking review packs exported to ${outputDirectory}`);
