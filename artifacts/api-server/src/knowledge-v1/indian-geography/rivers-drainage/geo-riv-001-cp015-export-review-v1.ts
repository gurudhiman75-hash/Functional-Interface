import fs from "node:fs";
import path from "node:path";
import {
  GEO_RIV_001_CP015_REVIEW_BATCH_V2,
  auditGeoRiv001Cp015ReviewBatchV2,
} from "./geo-riv-001-cp015-review-batch-v2";

const audit = auditGeoRiv001Cp015ReviewBatchV2();
if (!audit.valid) throw new Error(`CP015 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP015-V2");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-RIV-001 CP015 — Mixed Rivers Mastery — Review Batch V2",
  "",
  "> **Post-CP007 base note:** CP007 is approved and merged. This CP015 batch is revalidated directly against the resulting `New-main` and carries no stacked CP007 implementation files.",
  "",
  "> **Learner-surface note:** V2 normalizes proper river names to the chapter-wide `River + name` convention without changing source truth, inherited QL identity, provenance, difficulty or semantic answer authority.",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Distinct inherited QLs:** ${audit.inheritedQlCount}  `,
  `**Semantic unique:** ${audit.semanticUniqueCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}`,
  "",
  "## Source checkpoint coverage",
  "",
  ...Object.entries(audit.cpCounts).sort(([a], [b]) => a.localeCompare(b)).map(([cpId, count]) => `- ${cpId}: ${count}`),
  "",
  "---",
  "",
];

GEO_RIV_001_CP015_REVIEW_BATCH_V2.forEach((question, index) => {
  lines.push(
    `## ${index + 1}. ${question.stem}`,
    "",
    ...question.options.map((option, optionIndex) => `${letters[optionIndex]}. ${option}`),
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.canonicalAnswer}`,
    "",
    `**Explanation:** ${question.explanation}`,
    "",
    `**Difficulty:** ${question.difficulty}`,
    "",
    `**Inherited QL:** ${question.qlId} — ${question.qlName}`,
    "",
    `**Source checkpoint:** ${question.sourceCpId}`,
    "",
    `**Source question:** ${question.sourceQuestionId}`,
    "",
    `**Source facts:** ${question.sourceFactIds.join(", ")}`,
    "",
    `**Sources:** ${question.sourceIds.join(", ")}`,
    "",
    "---",
    "",
  );
});

const markdown = lines.join("\n");
const baseName = "GEO-RIV-001-CP015-REVIEW-BATCH-V2";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), markdown);
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_RIV_001_CP015_REVIEW_BATCH_V2 }, null, 2));
const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
fs.writeFileSync(path.join(outDir, `${baseName}.html`), `<!doctype html><html><head><meta charset="utf-8"><title>GEO-RIV-001 CP015 Review V2</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:40px auto;line-height:1.5;padding:0 20px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${escaped}</pre></body></html>`);
console.log(JSON.stringify(audit));
