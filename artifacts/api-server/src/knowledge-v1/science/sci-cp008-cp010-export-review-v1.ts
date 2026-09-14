import fs from "node:fs";
import path from "node:path";
import { SCI_CP008_REVIEW_BATCH_V1 } from "./electricity/sci-cp008-review-v1";
import { SCI_CP009_REVIEW_BATCH_V1 } from "./magnetism-electromagnetism/sci-cp009-review-v1";
import { SCI_CP010_REVIEW_BATCH_V1 } from "./modern-physics/sci-cp010-review-v1";

const batches = [
  ["SCI-CP-008", "Electricity", SCI_CP008_REVIEW_BATCH_V1],
  ["SCI-CP-009", "Magnetism & Electromagnetism", SCI_CP009_REVIEW_BATCH_V1],
  ["SCI-CP-010", "Modern Physics & Everyday Devices", SCI_CP010_REVIEW_BATCH_V1],
] as const;
const letters = ["A", "B", "C", "D"];
const lines:string[] = [
  "# Science Physics Final Review V1 — SCI-CP-008 to SCI-CP-010",
  "",
  "Status: **REVIEW-ONLY CANDIDATE V1**",
  "",
  "## Audit summary",
  "",
  "- 180 questions total; 60 per CP.",
  "- Each CP: Easy 18 / Medium 30 / Hard 12.",
  "- Each CP: answer positions A15 / B15 / C15 / D15.",
  "- Each CP: 10 QLs × 6 questions.",
  "- Not registered in Question Studio; approval required before promotion.",
  "",
];
for (const [cp, title, batch] of batches) {
  lines.push(`# ${cp} — ${title}`, "");
  let current = "";
  for (const q of batch) {
    if (q.qlId !== current) {
      current = q.qlId;
      lines.push(`## ${q.qlId} — ${q.qlName}`, "");
    }
    lines.push(`### ${q.questionId} · ${q.difficulty}`, "", q.stem, "");
    q.options.forEach((o, i) => lines.push(`${letters[i]}. ${o}`));
    lines.push("", `**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`, "");
  }
}
const outDir = path.resolve("dist/science-review/SCI-PHYSICS-FINAL-V1");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "SCI-PHYSICS-FINAL-CP008-CP010-REVIEW-V1.md"), lines.join("\n") + "\n");
console.log("review artifact written");
