import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateTsdEnglishFrozenRecords } from "./english-frozen";

const rows = generateTsdEnglishFrozenRecords();
const outputDir = resolve(process.cwd(), "dist/quant-v4/tsd-001/english-frozen");
mkdirSync(outputDir, { recursive: true });

writeFileSync(
  resolve(outputDir, "tsd-english-frozen.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  resolve(outputDir, "tsd-english-frozen.jsonl"),
  `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_001_ENGLISH_FROZEN_EXPORT",
  outputDir,
  records: rows.length,
  learnerAuthorities: new Set(rows.map((row) => row.solveMode)).size,
  permanentQls: 0,
  englishFreezeStatus: "FROZEN",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
