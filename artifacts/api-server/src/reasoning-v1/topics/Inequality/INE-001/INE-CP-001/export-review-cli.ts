import path from "node:path";

import { exportIneCp001ReviewPack } from "./export-review";

const outputDirectory = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(
      "src/reasoning-v1/topics/Inequality/INE-001/INE-CP-001/review",
    );
const seedsPerPrototype = Number.parseInt(process.argv[3] ?? "5", 10);
const result = await exportIneCp001ReviewPack(
  outputDirectory,
  seedsPerPrototype,
);

console.log("INE-CP-001 English review pack exported.", result);
