import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V1,
  auditGeoRiv001Cp001ReviewBatch,
} from "./geo-riv-001-cp001-review-batch";

const audit = auditGeoRiv001Cp001ReviewBatch();
if (!audit.valid) {
  throw new Error(`GEO-RIV-001 CP001 review batch audit failed: ${audit.issues.join(", ")}`);
}

const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP001");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V1.json");
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      chapterId: "GEO-RIV-001",
      cpId: "GEO-RIV-001-CP001",
      status: "REVIEW_ONLY",
      audit,
      questions: GEO_RIV_001_CP001_REVIEW_BATCH_V1,
    },
    null,
    2,
  ),
  "utf8",
);

const lines: string[] = [
  "# GEO-RIV-001-CP001 Review Batch V1",
  "",
  "**Chapter:** Indian Rivers & Drainage System",
  "**CP:** Drainage Basics & River Classification",
  "**Status:** Review-only; not runtime registered",
  `**Questions:** ${GEO_RIV_001_CP001_REVIEW_BATCH_V1.length}`,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`,
  "",
  "---",
  "",
];

for (const [index, q] of GEO_RIV_001_CP001_REVIEW_BATCH_V1.entries()) {
  lines.push(`## ${index + 1}. ${q.qlId} · ${q.qlName} · ${q.difficulty}`);
  lines.push("");
  lines.push(q.stem);
  lines.push("");
  q.options.forEach((option, optionIndex) => {
    const letter = String.fromCharCode(65 + optionIndex);
    lines.push(`${letter}. ${option}`);
  });
  lines.push("");
  lines.push(`**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`);
  lines.push("");
  lines.push(`**Explanation:** ${q.explanation}`);
  lines.push("");
  lines.push(`**Source IDs:** ${q.sourceIds.join(", ")}`);
  lines.push(`**Fact IDs:** ${q.sourceFactIds.join(", ")}`);
  lines.push(`**Solver:** ${q.solverAuthority}`);
  lines.push("");
  lines.push("---");
  lines.push("");
}

const mdPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V1.md");
writeFileSync(mdPath, lines.join("\n"), "utf8");

console.log(JSON.stringify({ jsonPath, mdPath, audit }, null, 2));
