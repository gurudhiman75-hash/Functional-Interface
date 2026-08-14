import path from "node:path";
import { exportWorReviewPacks } from "./review-pack";

const outputDirectory = path.resolve("src/reasoning-v1/topics/Word-Dictionary-Order/WOR-001/review");
await exportWorReviewPacks(outputDirectory);
console.log(`WOR-001 review packs exported to ${outputDirectory}`);
