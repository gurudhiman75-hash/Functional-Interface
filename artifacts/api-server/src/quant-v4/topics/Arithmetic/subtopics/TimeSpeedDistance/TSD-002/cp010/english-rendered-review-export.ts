import { writeFileSync } from "node:fs";
import { TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW } from "./exam-real-review-final-v2";

const outputPath = process.argv[2] ?? "TSD-CP010-ENGLISH-QUESTIONS.md";
const lines: string[] = [
  "# TSD-CP-010 — English Question Review",
  "",
  "Questions only. Answers and explanations intentionally omitted for product-owner review.",
  "",
];
let currentQl = "";
for (const question of TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW) {
  if (question.qlId !== currentQl) {
    currentQl = question.qlId;
    lines.push(`## ${currentQl}`, "");
  }
  lines.push(`### ${question.familyId} · ${question.difficulty}`, "", question.stem, "");
}
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW.length} CP010 exam-real V2 English review questions to ${outputPath}`);
