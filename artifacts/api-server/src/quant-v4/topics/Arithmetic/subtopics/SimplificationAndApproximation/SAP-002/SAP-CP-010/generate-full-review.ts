import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateSapCp010ReviewRecords } from "./full-review";

const records = generateSapCp010ReviewRecords();
const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/sap-cp010-review");
mkdirSync(outDir, { recursive: true });

const summary = {
  checkpointId: "SAP-CP-010",
  title: "Approximate Roots, Powers, Reciprocals and Derived Values",
  reviewVersion: "CP010-EXAM-STANDARD-V1",
  questionCount: records.length,
  identities: [...new Set(records.map((r) => r.prototypeId))].length,
  candidateQlRange: "SAP-QL-166..182",
  answerPositions: [0, 1, 2, 3].map((p) => records.filter((r) => r.correctIndex === p).length),
  lifecycle: "INACTIVE_HUMAN_REVIEW_CANDIDATE",
  editorialContract: "EXAM_STANDARD_STEMS_SIMPLE_2_TO_3_STEP_EXPLANATIONS",
  heldMethods: ["NEAREST_TENTH_ROOT_WITHOUT_SOURCE_EVIDENCE", "INTERPOLATION_WITHOUT_SOURCE_EVIDENCE", "ADVANCED_NUMERICAL_METHODS"],
};

const lines: string[] = [
  "# SAP-CP-010 — 300-Question English Human Review — Exam Standard V1",
  "",
  `Questions: **${summary.questionCount}**  `,
  `Solve identities: **${summary.identities}**  `,
  `Candidate QLs: **${summary.candidateQlRange}**  `,
  `Answer positions A/B/C/D: **${summary.answerPositions.join(" / ")}**`,
  "",
  "> All questions are provisional and inactive. Stems use competitive-exam language; explanations use short benchmark/bracketing reasoning. Unsupported interpolation and advanced numerical methods are deliberately excluded.",
  "",
];

for (const r of records) {
  lines.push(`## ${r.questionId} — ${r.proposedPermanentQlId}`);
  lines.push("");
  lines.push(`**Family:** \`${r.prototypeId}\`  `);
  lines.push(`**Difficulty:** ${r.difficulty}`);
  lines.push("");
  lines.push(r.stem);
  lines.push("");
  r.options.forEach((o, i) => lines.push(`${String.fromCharCode(65 + i)}. ${o.value}`));
  lines.push("");
  lines.push(`**Correct answer:** ${String.fromCharCode(65 + r.correctIndex)} — ${r.canonicalAnswer}`);
  lines.push("");
  lines.push(`**Idea:** ${r.explanation.coreConcept}`);
  lines.push("");
  lines.push("**Working:**");
  r.explanation.steps.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
  lines.push("");
  lines.push(`**Final:** ${r.explanation.finalAnswer}`);
  lines.push("");
  lines.push("**Quick check:**");
  r.explanation.verification.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("**Option check:**");
  r.options.forEach((o, i) => lines.push(`- ${String.fromCharCode(65 + i)}: ${o.isCorrect ? "Correct." : o.analysis}`));
  lines.push("");
}

const markdown = lines.join("\n");
const escaped = markdown.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>SAP-CP-010 Exam Standard V1 Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:24px auto;padding:0 20px;line-height:1.5;color:#222}pre{white-space:pre-wrap;font-family:Arial,sans-serif}h1{border-bottom:2px solid #333}</style></head><body><pre>${escaped}</pre></body></html>`;

writeFileSync(resolve(outDir, "SAP-CP-010-300-FULL-ENGLISH-REVIEW.md"), markdown, "utf8");
writeFileSync(resolve(outDir, "SAP-CP-010-300-FULL-ENGLISH-REVIEW.html"), html, "utf8");
writeFileSync(resolve(outDir, "SAP-CP-010-300-FULL-ENGLISH-REVIEW.json"), JSON.stringify({ summary, records }, null, 2), "utf8");
writeFileSync(resolve(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(JSON.stringify(summary));
