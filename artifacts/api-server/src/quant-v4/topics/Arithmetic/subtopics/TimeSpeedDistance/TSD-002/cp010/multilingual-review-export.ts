import { writeFileSync } from "node:fs";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";

const outputPath = process.argv[2] ?? "TSD-CP010-MULTILINGUAL-QUESTIONS.md";
const lines: string[] = [
  "# TSD-CP-010 — Multilingual Question Review",
  "",
  "Questions only. Answers and explanations intentionally omitted for product-owner review.",
  "",
];

for (const [label, questions] of [
  ["English", TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW],
  ["Hindi", TSD_CP010_NATIVE_FINAL_HINDI_REVIEW],
  ["Punjabi", TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW],
] as const) {
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
console.log(`Wrote ${TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.length + TSD_CP010_NATIVE_FINAL_HINDI_REVIEW.length + TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW.length} CP010 questions to ${outputPath}`);
