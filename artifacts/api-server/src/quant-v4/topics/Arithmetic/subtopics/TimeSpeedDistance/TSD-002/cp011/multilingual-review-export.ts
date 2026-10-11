import { writeFileSync } from "node:fs";
import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_RELEASE_HINDI_REVIEW, TSD_CP011_RELEASE_PUNJABI_REVIEW } from "./native-review-release";

export function buildTsdCp011MultilingualQuestionsReview(): string {
  const lines: string[] = [
    "# TSD-CP-011 — Multilingual Questions Review",
    "",
    "Questions only. Answers and explanations are intentionally excluded from this product-owner review surface.",
    "",
  ];

  const sections = [
    ["English", TSD_CP011_ENGLISH_REVIEW],
    ["Hindi", TSD_CP011_RELEASE_HINDI_REVIEW],
    ["Punjabi", TSD_CP011_RELEASE_PUNJABI_REVIEW],
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
  if (!output) throw new Error("Output path is required for the CP011 multilingual review export.");
  writeFileSync(output, buildTsdCp011MultilingualQuestionsReview(), "utf8");
  console.log(`TSD-CP-011 multilingual questions review written to ${output}`);
}
