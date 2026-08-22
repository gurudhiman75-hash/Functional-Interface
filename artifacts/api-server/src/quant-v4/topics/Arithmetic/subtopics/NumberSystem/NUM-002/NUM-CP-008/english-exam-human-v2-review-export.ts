import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { NUM_CP008_PERMANENT_ALLOCATION } from "./permanent-allocation.ts";
import { generateNumCp008Permanent, type NumCp008PermanentQlId } from "./permanent-runtime.ts";

const samplesPerQl = 3;
const lines: string[] = [
  "# ExamTree — NUM-CP-008 English Exam-Human V2 Review",
  "",
  "**Chapter:** Number System",
  "",
  "**Checkpoint:** NUM-CP-008 — Remainders / Modular Arithmetic",
  "",
  `**Permanent authorities:** ${NUM_CP008_PERMANENT_ALLOCATION.length} (NUM-QL-166..184)`,
  "",
  `**Review questions:** ${NUM_CP008_PERMANENT_ALLOCATION.length * samplesPerQl} (${samplesPerQl} per permanent authority)`,
  "",
  "This review surface intentionally keeps the mathematics and answer binding unchanged while presenting questions in competitive-exam English and solutions in simple human language.",
  "",
  "---",
  "",
];

for (const allocation of NUM_CP008_PERMANENT_ALLOCATION) {
  const qlId = allocation.qlId as NumCp008PermanentQlId;
  lines.push(`## ${qlId} — ${allocation.label}`, "");

  for (let sample = 1; sample <= samplesPerQl; sample += 1) {
    const seed = sample;
    const q = generateNumCp008Permanent(qlId, seed);
    lines.push(`### Q${sample}. Sample ${sample}`, "");
    lines.push(`**Difficulty:** ${q.difficulty}`, "");
    lines.push(q.stem, "");
    q.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.value}`));
    lines.push("");
    lines.push(`**Correct answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "");
    lines.push("**Solution:**", "");
    q.explanation.steps.forEach((step) => lines.push(`- ${step}`));
    lines.push("");
    lines.push(`**Final answer:** ${q.explanation.finalAnswer}`, "", "---", "");
  }
}

const output = resolve(process.cwd(), "dist/quant-v4/num-cp008-english-exam-human-v2-review.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "PASS_NUM_CP008_ENGLISH_V2_REVIEW_EXPORT", output, questions: 57 }, null, 2));
