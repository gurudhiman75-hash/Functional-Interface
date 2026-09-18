import fs from "node:fs";
import path from "node:path";
import { generateEnvCp001LocalizedReviewV1 } from "./env-cp001-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const labels: Record<EnvLocaleV1, string> = { en: "English", hi: "Hindi", pa: "Punjabi" };
const locales: EnvLocaleV1[] = ["en", "hi", "pa"];
const targetDir = path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });

function renderQuestion(question: EnvLocalizedQuestionV1, index: number): string[] {
  const out = [`**${index + 1}. ${question.stem}**`];
  question.options.forEach((option, optionIndex) => out.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  out.push(`**Answer:** ${String.fromCharCode(65 + question.correctIndex)} — ${question.canonicalAnswer}`);
  out.push(`**Explanation:** ${question.explanation}`, "");
  return out;
}

const out: string[] = [
  "# Environment Multilingual V1 — CP001 Review",
  "",
  "Review-only candidate. Frozen English V4 remains semantic authority. Hindi and Punjabi preserve CP, QL, difficulty, source provenance, option order and correct-index parity.",
  "",
];

for (const locale of locales) {
  out.push(`## ${labels[locale]}`, "");
  generateEnvCp001LocalizedReviewV1(locale).forEach((question, index) => out.push(...renderQuestion(question, index)));
}

const target = path.join(targetDir, "ENV-MULTILINGUAL-V1-CP001-REVIEW.md");
fs.writeFileSync(target, out.join("\n"));
console.log(target);
