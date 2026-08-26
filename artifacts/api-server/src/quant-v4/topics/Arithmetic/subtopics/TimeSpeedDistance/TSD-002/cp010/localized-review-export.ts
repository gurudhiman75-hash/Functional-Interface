import { writeFileSync } from "node:fs";
import { TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW, TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW } from "./exam-real-review-final-v2";

const outputPath = process.argv[2] ?? "TSD-CP010-HINDI-PUNJABI-QUESTIONS.md";
const lines: string[] = [
  "# TSD-CP-010 — Hindi + Punjabi Question Review",
  "",
  "Questions only. Answers and explanations intentionally omitted for product-owner review.",
  "",
];

for (const [label, questions] of [["Hindi", TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW], ["Punjabi", TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW]] as const) {
  lines.push(`# ${label}`, "");
  let currentQl = "";
  for (const question of questions) {
    if (question.qlId !== currentQl) {
      currentQl = question.qlId;
      lines.push(`## ${currentQl}`, "");
    }
    lines.push(`### ${question.familyId} · ${question.difficulty}`, "", question.stem, "");
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW.length + TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW.length} exam-real V2 native CP010 review questions to ${outputPath}`);
