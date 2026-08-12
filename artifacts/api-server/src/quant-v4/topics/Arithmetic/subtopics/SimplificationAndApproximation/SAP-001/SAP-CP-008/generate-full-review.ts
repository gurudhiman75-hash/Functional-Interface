import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateSapCp008ReviewRecords } from "./full-review";

const records = generateSapCp008ReviewRecords();
const outDir = resolve(process.cwd(), "artifacts/api-server/dist/quant-v4/sap-cp008-review");
mkdirSync(outDir, { recursive: true });

const summary = {
  checkpointId: "SAP-CP-008",
  title: "Approximate Sums, Differences and Mixed Operation Chains",
  questionCount: records.length,
  identities: [...new Set(records.map((record) => record.prototypeId))].length,
  candidateQlRange: "SAP-QL-129..146",
  answerPositions: [0,1,2,3].map((position) => records.filter((record) => record.correctIndex === position).length),
  lifecycle: "INACTIVE_HUMAN_REVIEW_CANDIDATE",
};

const markdown: string[] = [
  "# SAP-CP-008 — 300-Question English Human Review",
  "",
  `Questions: **${summary.questionCount}**  `,
  `Solve identities: **${summary.identities}**  `,
  `Candidate QLs: **${summary.candidateQlRange}**  `,
  `Answer positions A/B/C/D: **${summary.answerPositions.join(" / ")}**`,
  "",
  "> All questions are provisional and inactive. The learner policy is explicitly declared in every stem.",
  "",
];

for (const record of records) {
  markdown.push(`## ${record.questionId} — ${record.proposedPermanentQlId}`);
  markdown.push("");
  markdown.push(`**Family:** \`${record.prototypeId}\`  `);
  markdown.push(`**Difficulty:** ${record.difficulty}  `);
  markdown.push(`**Seed:** ${record.seed}`);
  markdown.push("");
  markdown.push(record.stem);
  markdown.push("");
  record.options.forEach((option, index) => markdown.push(`${String.fromCharCode(65 + index)}. ${option.value}`));
  markdown.push("");
  markdown.push(`**Correct answer:** ${String.fromCharCode(65 + record.correctIndex)} — ${record.canonicalAnswer}`);
  markdown.push("");
  markdown.push(`**Concept:** ${record.explanation.coreConcept}`);
  markdown.push("");
  markdown.push("**Working:**");
  record.explanation.steps.forEach((step, index) => markdown.push(`${index + 1}. ${step}`));
  markdown.push("");
  markdown.push(`**Final:** ${record.explanation.finalAnswer}`);
  markdown.push("");
  markdown.push("**Verification:**");
  record.explanation.verification.forEach((step) => markdown.push(`- ${step}`));
  markdown.push("");
  markdown.push("**Option diagnostics:**");
  record.options.forEach((option, index) => markdown.push(`- ${String.fromCharCode(65 + index)}: ${option.isCorrect ? "Correct." : option.analysis}`));
  markdown.push("");
}

const md = markdown.join("\n");
const escaped = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>SAP-CP-008 300 Review</title><style>body{font-family:Arial,sans-serif;max-width:1050px;margin:24px auto;padding:0 20px;line-height:1.48;color:#222}pre{white-space:pre-wrap;font-family:Arial,sans-serif}h1{border-bottom:2px solid #333;padding-bottom:10px}</style></head><body><pre>${escaped}</pre></body></html>`;

writeFileSync(resolve(outDir, "SAP-CP-008-300-FULL-ENGLISH-REVIEW.md"), md, "utf8");
writeFileSync(resolve(outDir, "SAP-CP-008-300-FULL-ENGLISH-REVIEW.html"), html, "utf8");
writeFileSync(resolve(outDir, "SAP-CP-008-300-FULL-ENGLISH-REVIEW.json"), JSON.stringify({ summary, records }, null, 2), "utf8");
writeFileSync(resolve(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
console.log(JSON.stringify(summary));
