import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V2G,
  auditGeoRiv001Cp001ReviewBatchV2G,
} from "./geo-riv-001-cp001-review-batch-v2g";

// This exporter is intentionally review-only. Keeping the materialized packet
// separate from runtime registration lets editorial review remain an explicit
// gate before any Question Studio freeze or downstream lifecycle promotion.
const audit = auditGeoRiv001Cp001ReviewBatchV2G();
if (!audit.valid) {
  throw new Error(`GEO-RIV-001 CP001 V2G review batch audit failed: ${audit.issues.join(", ")}`);
}

const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP001");
mkdirSync(outDir, { recursive: true });

const jsonPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V2G.json");
writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      chapterId: "GEO-RIV-001",
      cpId: "GEO-RIV-001-CP001",
      authority: "V2G",
      status: "REVIEW_ONLY",
      audit,
      questions: GEO_RIV_001_CP001_REVIEW_BATCH_V2G,
    },
    null,
    2,
  ),
  "utf8",
);

const lines: string[] = [
  "# GEO-RIV-001-CP001 Review Batch V2G",
  "",
  "**Chapter:** Indian Rivers & Drainage System",
  "**CP:** Drainage Basics & River Classification",
  "**Authority:** V2G editorial review candidate",
  "**Status:** Review-only; not runtime registered",
  `**Questions:** ${GEO_RIV_001_CP001_REVIEW_BATCH_V2G.length}`,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`,
  `**Editorially unique tasks:** ${audit.editorialSemanticUniqueCount ?? "n/a"}`,
  "",
  "---",
  "",
];

for (const [index, q] of GEO_RIV_001_CP001_REVIEW_BATCH_V2G.entries()) {
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

const mdPath = resolve(outDir, "GEO-RIV-001-CP001-REVIEW-BATCH-V2G.md");
writeFileSync(mdPath, lines.join("\n"), "utf8");

console.log(JSON.stringify({ jsonPath, mdPath, audit }, null, 2));
