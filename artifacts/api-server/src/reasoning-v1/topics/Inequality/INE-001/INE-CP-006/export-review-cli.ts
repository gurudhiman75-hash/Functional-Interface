import path from "node:path";
import { exportIneCp006ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ??
    path.join(
      process.cwd(),
      "src/reasoning-v1/topics/Inequality/INE-001/INE-CP-006/review",
    ),
);
const result = await exportIneCp006ReviewPack(outputDirectory);
console.log("INE-CP-006 English review pack exported.", result);
