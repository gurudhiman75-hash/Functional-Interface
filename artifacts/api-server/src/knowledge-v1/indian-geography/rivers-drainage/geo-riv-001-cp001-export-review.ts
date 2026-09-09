import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V2D,
  auditGeoRiv001Cp001ReviewBatchV2D,
} from "./geo-riv-001-cp001-review-batch-v2d";

const audit = auditGeoRiv001Cp001ReviewBatchV2D();
if (!audit.valid) {
  throw new Error(`GEO-RIV-001 CP001 V2D review batch audit failed: ${audit.issues.join(", ")}`);
}

const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP001");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V2D.json");
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      chapterId: "GEO-RIV-001",
      cpId: "GEO-RIV-001-CP001",
      authority: "V2D",
      status: "REVIEW_ONLY",
      audit,
      questions: GEO_RIV_001_CP001_REVIEW_BATCH_V2D,
    },
    null,
    2,
  ),
  "utf8",
);

const lines: string[] = [
  "# GEO-RIV-001-CP001 Review Batch V2D",
  "",
  "**Chapter:** Indian Rivers & Drainage System",
  "**CP:** Drainage Basics & River Classification",
  "**Authority:** V2D review candidate",
  "**Status:** Review-only; not runtime registered",
  `**Questions:** ${GEO_RIV_001_CP001_REVIEW_BATCH_V2D.length}`,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`,
  `**Unique stems:** ${audit.uniqueStemCount ?? "n/a"}`,
  "",
  "---",
  "",
];

for (const [index, q] of GEO_RIV_001_CP001_REVIEW_BATCH_V2D.entries()) {
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

const mdPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V2D.md");
writeFileSync(mdPath, lines.join("\n"), "utf8");

console.log(JSON.stringify({ jsonPath, mdPath, audit }, null, 2));
