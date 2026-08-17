import fs from "node:fs";
import path from "node:path";
import {
  auditMenCp010PermanentEnglishReview,
  buildMenCp010PermanentEnglishReview,
} from "./review-v1";

const records = buildMenCp010PermanentEnglishReview();
const audit = auditMenCp010PermanentEnglishReview();
const apiRoot = fs.existsSync(path.resolve(process.cwd(), "artifacts/api-server"))
  ? path.resolve(process.cwd(), "artifacts/api-server")
  : process.cwd();
const outputDir = path.resolve(apiRoot, "dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });

const json = {
  authority: audit.authority,
  status: "PERMANENT_ENGLISH_RUNTIME_CANDIDATE__HUMAN_REVIEW_REQUIRED__PRODUCT_LOCKED",
  audit,
  records: records.map((q) => ({
    qlId: q.permanentQlId,
    templateId: q.templateId,
    solveModeId: q.solveModeId,
    clusterId: q.clusterId,
    title: q.title,
    sourceWave: q.sourceWave,
    sourceId: q.sourceId,
    seed: q.seed,
    stem: q.stem,
    options: q.options,
    correctIndex: q.correctIndex,
    answer: q.answer,
    explanation: q.explanation,
    verification: q.verification,
  })),
};

fs.writeFileSync(
  path.join(outputDir, "men-cp010-permanent-english-review-v1.json"),
  JSON.stringify(json, null, 2),
);

const md: string[] = [
  "# MEN-CP-010 Permanent English Runtime V1 — Human Review",
  "",
  `- Permanent QLs: ${audit.permanentQlCount}`,
  `- Review records: ${audit.reviewRecordCount}`,
  `- Records per QL: ${audit.recordsPerQl}`,
  `- Answer positions: A=${audit.correctPositions.A}, B=${audit.correctPositions.B}, C=${audit.correctPositions.C}, D=${audit.correctPositions.D}`,
  `- Machine verification: ${audit.allVerified ? "PASS" : "FAIL"}`,
  `- English implementation frozen: ${audit.englishImplementationFrozen}`,
  `- Product lifecycle locked: ${audit.productLocked}`,
  "",
  "> Review purpose: judge exam realism, stem clarity, option quality, explanation quality, and whether each permanent reasoning family deserves English freeze. Machine validity alone is not approval.",
  "",
];

for (const [index, q] of records.entries()) {
  md.push(`## ${index + 1}. ${q.permanentQlId} — ${q.title}`);
  md.push("");
  md.push(`**Cluster:** ${q.clusterId}`);
  md.push(`**Source:** ${q.sourceWave} / ${q.sourceId}`);
  md.push(`**Seed:** ${q.seed}`);
  md.push("");
  md.push(q.stem);
  md.push("");
  for (const option of q.options) {
    md.push(`- ${option.label}. ${option.display}${option.isCorrect ? " **✓**" : ""}`);
  }
  md.push("");
  md.push(`**Answer:** ${q.answer}`);
  md.push("");
  md.push(`**Key rule:** ${q.explanation.keyRule}`);
  md.push("");
  for (const step of q.explanation.steps) {
    md.push(`- **${step.title}:** ${step.body}`);
  }
  md.push("");
  md.push(`**Shortcut:** ${q.explanation.shortcut}`);
  md.push("");
  md.push(`**Traps:** ${q.explanation.traps.join(" | ")}`);
  md.push("");
}

fs.writeFileSync(
  path.join(outputDir, "men-cp010-permanent-english-review-v1.md"),
  md.join("\n"),
);

console.log(JSON.stringify({ outputDir, audit }, null, 2));
