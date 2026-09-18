import fs from "node:fs";
import path from "node:path";
import { generateHisCp007LocalizedReviewV1 } from "./his-cp007-localization-v1";
import type { HisLocaleV1, HisLocalizedQuestionV1 } from "./his-localization-types-v1";

const labels: Record<HisLocaleV1, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };
const locales: HisLocaleV1[] = ["en", "hi", "pa"];
const outDir = path.resolve(process.cwd(), "dist/history-review/HIS-MULTILINGUAL-V1");
fs.mkdirSync(outDir, { recursive: true });

function renderQuestion(q: HisLocalizedQuestionV1, index: number): string[] {
  return [
    `**${index + 1}. ${q.stem}**`,
    ...q.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`),
    `**Answer:** ${String.fromCharCode(65 + q.correctIndex)} — ${q.canonicalAnswer}`,
    `**Explanation:** ${q.explanation}`,
    "",
  ];
}

const lines: string[] = [
  "# History Multilingual V1 — HIS-CP-007 Review",
  "",
  "Review-only candidate. HIS-001-ENGLISH-FREEZE-V1 remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",
  "",
];
for (const locale of locales) {
  lines.push(`## ${labels[locale]}`, "");
  generateHisCp007LocalizedReviewV1(locale).forEach((q, index) => lines.push(...renderQuestion(q, index)));
}
const target = path.join(outDir, "HIS-MULTILINGUAL-V1-CP007-REVIEW.md");
fs.writeFileSync(target, lines.join("\n"));
console.log(target);
