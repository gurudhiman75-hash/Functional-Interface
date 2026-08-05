import path from "node:path";

import { exportIneCp002ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), "review"),
);
const seedsPerPrototype = Number.parseInt(process.argv[3] ?? "5", 10);
const result = await exportIneCp002ReviewPack(
  outputDirectory,
  seedsPerPrototype,
);
console.log("INE-CP-002 English review pack exported.", result);
