import path from "node:path";
import { exportIneCp007ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), "src/reasoning-v1/topics/Inequality/INE-001/INE-CP-007/review"),
);
console.log("INE-CP-007 English review pack exported.", await exportIneCp007ReviewPack(outputDirectory));
