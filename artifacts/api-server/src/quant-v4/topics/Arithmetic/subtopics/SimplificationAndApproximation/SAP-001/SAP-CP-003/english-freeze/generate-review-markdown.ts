import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp003ExplanationReviewExport } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "SAP-CP-003-57-EXPLANATION-REVIEW.md");
const records = generateSapCp003ExplanationReviewExport();
const lines: string[] = [
  "# SAP-CP-003 — Explanation Review",
  "",
  "This compact review contains 57 representative questions: three from each permanent QL.",
  "Questions and answers are already approved. Explanations remain pending human approval.",
  "",
];

records.forEach((record, index) => {
  lines.push(`## ${index + 1}. ${record.permanentQlId} — ${record.difficulty}`);
  lines.push("");
  lines.push(`**Question:** ${record.stem.replace(/\n/g, "  \n")}`);
  lines.push("");
  lines.push(`**Correct answer:** ${record.correctAnswer}`);
  lines.push("");
  lines.push(`**Core concept:** ${record.explanation.coreConcept}`);
  lines.push("");
  lines.push(`**Strategy:** ${record.explanation.givenDataAndStrategy}`);
  lines.push("");
  lines.push("**Step-by-step:**");
  for (const step of record.explanation.stepByStep) lines.push(`- ${step}`);
  lines.push("");
  lines.push(`**Why this works:** ${record.explanation.whyThisWorks}`);
  lines.push("");
  lines.push("**Common traps:**");
  for (const trap of record.explanation.commonTraps) lines.push(`- ${trap}`);
  lines.push("");
  lines.push(`**Final answer:** ${record.explanation.finalAnswer}`);
  lines.push("");
});

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_EXPLANATION_REVIEW",
  outputPath,
  recordCount: records.length,
  qlCount: new Set(records.map((record) => record.permanentQlId)).size,
  uniqueFingerprints: new Set(records.map((record) => record.explanationFingerprint)).size,
}, null, 2));
