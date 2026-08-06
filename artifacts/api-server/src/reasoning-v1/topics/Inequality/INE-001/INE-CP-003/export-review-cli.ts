import path from "node:path";

import { exportIneCp003ReviewPack } from "./export-review";

const outputDirectory = path.resolve(
  process.argv[2] ?? path.join(process.cwd(), "review"),
);
const seedsPerAuthority = Number.parseInt(process.argv[3] ?? "12", 10);
const result = await exportIneCp003ReviewPack(
  outputDirectory,
  seedsPerAuthority,
);
console.log("INE-CP-003 English review pack exported.", result);
