import { writeFileSync } from "node:fs";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";

export function buildTsdCp012MultilingualQuestionsReview(): string {
  const lines: string[] = [
    "# TSD-CP-012 — Multilingual Questions Review",
    "",
    "Questions only. Answers and explanations are intentionally excluded from this product-owner review surface.",
    "",
  ];
  const sections = [
    ["English", TSD_CP012_ENGLISH_REVIEW_FINAL],
    ["Hindi", TSD_CP012_NATIVE_HINDI_REVIEW_FINAL],
    ["Punjabi", TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL],
  ] as const;
  for (const [label, questions] of sections) {
    lines.push(`## ${label}`, "");
    questions.forEach((question, index) => {
      lines.push(`### ${index + 1}. ${question.qlId} · ${question.familyId}`, "", question.stem, "");
    });
  }
  return `${lines.join("\n")}\n`;
}

if (process.argv[1]?.endsWith("multilingual-review-export.ts")) {
  const output = process.argv[2];
  if (!output) throw new Error("Output path is required for the CP012 multilingual review export.");
  writeFileSync(output, buildTsdCp012MultilingualQuestionsReview(), "utf8");
  console.log(`TSD-CP-012 multilingual questions review written to ${output}`);
}
