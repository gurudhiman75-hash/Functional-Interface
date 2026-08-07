import path from "node:path";
import { exportIneCp005ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ??
    path.join(
      process.cwd(),
      "src/reasoning-v1/topics/Inequality/INE-001/INE-CP-005/review",
    ),
);
const seedsPerAuthority = Number.parseInt(process.argv[3] ?? "12", 10);
const result = await exportIneCp005ReviewPack(
  outputDirectory,
  seedsPerAuthority,
);
console.log("INE-CP-005 English review pack exported.", result);
