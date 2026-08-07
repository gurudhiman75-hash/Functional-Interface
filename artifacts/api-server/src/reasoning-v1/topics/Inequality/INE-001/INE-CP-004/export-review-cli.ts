import path from "node:path";

import { exportIneCp004ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), "review"),
);
const seedsPerAuthority = Number.parseInt(process.argv[3] ?? "12", 10);
const result = await exportIneCp004ReviewPack(
  outputDirectory,
  seedsPerAuthority,
);
console.log("INE-CP-004 English review pack exported.", result);
