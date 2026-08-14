import path from "node:path";
import { exportIneLocalizedReviewPacks } from "./review-pack";

const chapterDirectory = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), "src/reasoning-v1/topics/Inequality/INE-001"),
);
const outputDirectory = path.resolve(process.argv[3] ?? path.join(chapterDirectory, "localization", "review"));

console.log(
  "INE-001 Hindi and Punjabi review packs exported.",
  await exportIneLocalizedReviewPacks(chapterDirectory, outputDirectory),
);
